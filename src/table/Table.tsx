import {Pack, Question, QuestionType, Round} from "../Pack/Pack";
import './Table.css';
import {getClosedQuestions} from "../Pack/GetPack";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getEcho} from "../Events/Echo";
import {gameId, host} from "../Game/InitGame";
import axios from "axios";
import getPack from "../Storage/GetPack";
import {getQuestionById} from "../Storage/GetQuestionById";
import isHost from "../Storage/IsHost";
import localforage from "localforage";
interface Cell {
    text: string;
    key: string;
    type: CellType;
    question?: Question;
    title?: string;
    theme_questions: string[];
    ordered: boolean;
}

enum CellType {
    Question = 'question',
    Theme = 'theme'
}
interface Row {
    key: string;
    cells: Cell[];
    ordered: boolean
}

interface TableProps {
    round_number: number;
}


function Table(TableProps: TableProps) {

  const [hoverable, setHoverable] = useState<boolean>(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string|null>(null);
  const [player, setPlayer] = useState<any>(null);

  const navigate = useNavigate();
  useSubscribeToShowQuestion(navigate);
  useSubscribeToChooseQuestion(setHoverable, setSelectedQuestion)

  function askForAQuestion(cell:Cell) {
      axios.post(host() + '/api/question/choose', {
          game: gameId(),
            question: cell.question?.id,
      });
  }
    function getTd(cell: Cell): JSX.Element
    {
        let closedQuestions = getClosedQuestions();


        let ordered = cell.ordered;
        let shouldShowOrdered = true;
        if (ordered) {
            shouldShowOrdered = false;
            let themeQuestions = cell.theme_questions
            let questionId = cell.question?.id;
            if (themeQuestions[0] === questionId) {
                shouldShowOrdered = true;
            } else {
                let show = true;
                themeQuestions.forEach((themeQuestionId, index) => {
                    if (!questionId) {
                        return;
                    }
                    parseInt(themeQuestionId);
                    if ((parseInt(questionId) <= parseInt(themeQuestionId))) {
                        return;
                    }
                    console.log('ITS A QUESTION' + questionId)
                    console.log(closedQuestions.includes(parseInt(themeQuestionId)), 'includes')
                    if (!closedQuestions.includes(parseInt(themeQuestionId))) {
                        show = false;
                    }
                });
                console.log(show)
                if (show) {
                    shouldShowOrdered = true;
                }
            }
        }



        let key = cell.key;
        let isQuestion = cell.type===CellType.Question;
        let isEmpty = cell.question?.type === QuestionType.Empty
        let closed = closedQuestions.includes(parseInt(cell.key));
        let isTheme = cell.type===CellType.Theme;
        let title = isTheme ? cell.title : '';
        let showQuestion = isQuestion && !isEmpty && !closed ;
        let conductor = localStorage.getItem('control') === 'true';
        let canChoseQuestion = isQuestion && !isEmpty && !closed && hoverable && (isHost() || conductor) && shouldShowOrdered;
        let text = isQuestion ? (showQuestion ? cell.text : '-') : cell.text;
        if (!shouldShowOrdered) {
            text = '🔒';
        }
        let questionCellClasses = 'signil-cell signil-cell-question';
        if (canChoseQuestion) {
            questionCellClasses += ' hoverable';
        }

        if (cell.question?.id.toString() === selectedQuestion) {
            questionCellClasses += ' signil-cell-question-asked';
        }
        if (isTheme) {
            questionCellClasses += ' signil-cell-theme';
        }
        let classes = isQuestion ? (showQuestion ? questionCellClasses : 'signil-cell signil-cell-empty') : 'signil-cell signil-cell-theme';


        return <td onClick={() => canChoseQuestion ? askForAQuestion(cell) : ''} title={cell.title} className={classes} key={key} id={"cell-"+key}>{text}</td>
    }


    const round = TableProps.round_number
    const [pack, setPack] = useState<Pack|null>(null);
    if (pack) {
        wrongRoundErrorHandler(pack, round);
    }
    useEffect(() => {
        getPack().then((pack) => {
            if (!pack?.rounds?.[0]?.themes[0]?.questions[0].rules) {
                alert('pack is corrupted');
                localforage.removeItem('pack');
                return;
            }
            setPack(pack)
        });
    }, []);
    usePlayMusicTheme(pack, round);
    return <><table className="signil-table">
        <tbody>
        {getRows(round, pack).map((row: Row) =>
            <tr className="signil-row" key={row.key}>
                {row.cells.map((cell: Cell) =>
                    getTd(cell))}
            </tr>)}
        </tbody>
    </table>
        </>
    ;
}



function getRows(round_number: number, pack: Pack|null): Row[]
{
    if (!pack) {
        return [];
    }
    let rows: Row[] = [];
    pack.rounds[round_number].themes.forEach(function (theme, theme_number) {
        rows.push(getRow(pack, round_number, theme_number));
    });
    return rows;
}
function getRow(pack: Pack, round_number: number, theme_number: number): Row
{
    let cells: Cell[] = [];
    let ordered  = pack.rounds[round_number].themes[theme_number].ordered;
    cells.push({text: pack.rounds[round_number].themes[theme_number].name, key: 'theme-' + theme_number, type: CellType.Theme, title: pack.rounds[round_number].themes[theme_number].description} as Cell);
    let themeQuestionIds = pack.rounds[round_number].themes[theme_number].questions.map((question) => question.id);
    pack.rounds[round_number].themes[theme_number].questions.forEach(function (question: Question, index: number) {
        cells.push(createCell(question, themeQuestionIds, ordered));
    });
    return {key: 'theme-' + theme_number, cells: cells, ordered: pack.rounds[round_number].themes[theme_number].ordered ?? false};
}

function createCell(question: Question, themeQuestionId: string[], ordered: boolean): Cell
{
    return {
        text: getPrice(question),
        key: question.id,
        type: CellType.Question,
        question: question,
        theme_questions: themeQuestionId,
        ordered:ordered
    } as Cell;
}


function getPrice(question: Question): string
{
    if (question.type === QuestionType.Empty) {
        return '-';
    }
    return question.price?.text ?? '-';
}

export default Table;



function useSubscribeToShowQuestion(navigate: NavigateFunction) {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('ShowQuestion', function (message: any) {
                getQuestionById(message.question).then((question) => {
                    if (question) {
                        navigate('/question', {state: {question: question}})
                    }
                });
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('ShowQuestion');
        }
    }, [])
}


function useSubscribeToChooseQuestion(changeHoverable: (hoverable: boolean) => void, setSelectedQuestion: (question: string|null) => void) {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('ChooseQuestion', function (message: any) {
                getQuestionById(message.question).then((question) => {
                    if (question) {
                        changeHoverable(false);
                        setSelectedQuestion(question.id.toString());
                    }
                });
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('ChooseQuestion');
        }
    }, [])
}

function wrongRoundErrorHandler(pack: Pack, round: number)
{
    if (pack.rounds[round] === undefined) {
        alert('Хз як так вийшло, але такого раунду не існує, повертаю тебе до першого, перезавантаж сторінку');
        localStorage.setItem('round', '0');
    }
}

function usePlayMusicTheme(pack: Pack|null, round_number: number) {
    useEffect(() => {
        let musicalPlayer: HTMLAudioElement|null = null;
        if (!pack) {
            return;
        }
        let payingRound = pack.rounds[round_number];

        if (payingRound.music) {
            musicalPlayer = new Audio('data:audio/ogg;base64, ' + payingRound.music);
            musicalPlayer.volume=0.3
            musicalPlayer.play();
        }
        return () => {
            if (musicalPlayer) {
                musicalPlayer.pause();
            }
        }
    });
}