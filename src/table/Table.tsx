import {Pack, Question, QuestionType} from "../Pack/Pack";
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
}

enum CellType {
    Question = 'question',
    Theme = 'theme'
}
interface Row {
    key: string;
    cells: Cell[];
}

interface TableProps {
    round_number: number;
}


function Table(TableProps: TableProps) {

  const [hoverable, setHoverable] = useState<boolean>(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string|null>(null);

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

        let key = cell.key;
        let isQuestion = cell.type===CellType.Question;
        let isEmpty = cell.question?.type === QuestionType.Empty
        let closed = closedQuestions.includes(parseInt(cell.key));
        let isTheme = cell.type===CellType.Theme;
        let title = isTheme ? cell.title : '';
        let showQuestion = isQuestion && !isEmpty && !closed;
        let conductor = localStorage.getItem('control') === 'true';
        let canChoseQuestion = isQuestion && !isEmpty && !closed && hoverable && (isHost() || conductor);
        let text = isQuestion ? (showQuestion ? cell.text : '-') : cell.text;
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
    cells.push({text: pack.rounds[round_number].themes[theme_number].name, key: 'theme-' + theme_number, type: CellType.Theme, title: pack.rounds[round_number].themes[theme_number].description} as Cell);
    pack.rounds[round_number].themes[theme_number].questions.forEach(function (question: Question, index: number) {
        cells.push(createCell(question));
    });
    return {key: 'theme-' + theme_number, cells: cells};
}

function createCell(question: Question): Cell
{
    return {
        text: getPrice(question),
        key: question.id,
        type: CellType.Question,
        question: question
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