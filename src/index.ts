import Calculator from "./modules/calc";



function init()
{
    console.log("init started");
    const display:HTMLParagraphElement=document.querySelector('p#display')!!;
    const calc=new Calculator();
    const calcBtns=document.querySelectorAll('.calcButton');

    const handleDisplayUpdate = (val: string) => {
        display.innerText = val ? val : '0';
      };
    calc.setDisplayUpdateFunc(handleDisplayUpdate);

    const handleCalcBtnClick=(e:Event)=>
    {
        const el=<HTMLButtonElement>e.currentTarget;
        const {type,value} =el.dataset;
        console.log(type,value);
        calc.onClickListener({type, value});
    }
    calcBtns.forEach(btn => btn.addEventListener('click', handleCalcBtnClick));
    console.log("init completed");
}


document.addEventListener('DOMContentLoaded',init);