import {Pack, Question, QuestionType, Round, Theme} from "../Pack/Pack";
import './Table.css';
import GetPack, {getClosedQuestions} from "../Pack/GetPack";
import {Link, useLocation} from "react-router-dom";
import Muffin from "../apps/Muffin/Muffin";
import {symlink} from "fs";
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

function getTd(cell: Cell): JSX.Element
{
    let closedQuestions = getClosedQuestions();

    let key = cell.key;
    let isQuestion = cell.type===CellType.Question;
    let isEmpty = cell.question?.type === QuestionType.Empty
    let closed = closedQuestions.includes(parseInt(cell.key));

    let showQuestion = isQuestion && !isEmpty && !closed

    let text = isQuestion ? (showQuestion ? cell.text : '-') : cell.text;
    let linkUrl = <Link to="/question" state={{ question: cell.question}}> {text}</Link>


    return <td className="signil-cell" key={key}>{showQuestion ? linkUrl : text}</td>

}
export default Table;

