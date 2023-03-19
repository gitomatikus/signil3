function Muffin () {
    return <div id={"muffin-game"}  dangerouslySetInnerHTML= {{ __html: " <iframe src='http://127.0.0.1:8085' />"}} />;
}
export default Muffin;
