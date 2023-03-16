import {Pack, Question, QuestionType, Round, Theme} from "../Pack/Pack";
import './Table.css';
import GetPack, {getClosedQuestions} from "../Pack/GetPack";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Muffin from "../apps/Muffin/Muffin";
import {symlink} from "fs";
import {useEffect} from "react";
interface Cell {
    text: string;
    key: string;
    type: CellType;
    question?: Question;
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


function Table() {

  const navigate = useNavigate();

  function askForAQuestion(cell:Cell) {
        navigate('/question', {state:{ question: cell.question}});
  }
    function getTd(cell: Cell): JSX.Element
    {
        let closedQuestions = getClosedQuestions();

        let key = cell.key;
        let isQuestion = cell.type===CellType.Question;
        let isEmpty = cell.question?.type === QuestionType.Empty
        let closed = closedQuestions.includes(parseInt(cell.key));

        let showQuestion = isQuestion && !isEmpty && !closed

        let text = isQuestion ? (showQuestion ? cell.text : '-') : cell.text;
        let classes = isQuestion ? (showQuestion ? 'signil-cell signil-cell-question hoverable' : 'signil-cell signil-cell-empty') : 'signil-cell signil-cell-theme';


        return <td onClick={() => showQuestion ? askForAQuestion(cell) : ''} className={classes} key={key}>{text}</td>
    }


    const location = useLocation()
    const {round} = location.state
    const pack = GetPack;
    return <table className="signil-table">
        <tbody>
        {getRows(round, pack).map((row: Row) =>
            <tr className="signil-row" key={row.key}>
                {row.cells.map((cell: Cell) =>
                    getTd(cell))}
            </tr>)}

        </tbody>
    </table>;
}



function getRows(round_number: number, pack: Pack): Row[]
{

    let rows: Row[] = [];
    pack.rounds[round_number].themes.forEach(function (theme, theme_number) {
        rows.push(getRow(pack, round_number, theme_number));
    });
    return rows;
}
function getRow(pack: Pack, round_number: number, theme_number: number): Row
{
    let cells: Cell[] = [];
    cells.push({text: pack.rounds[round_number].themes[theme_number].name, key: 'theme-' + theme_number, type: CellType.Theme} as Cell);
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

