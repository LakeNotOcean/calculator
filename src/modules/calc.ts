import  {calcOp,action} from "./calcEnums";


interface Button
{
    type:string;
    value:string;
}

class calcNumb
{
    
    #stringValue:string;
    #isFrac:boolean;
    

    constructor()
    {
        this.#isFrac=false;
        this.#stringValue="0";

    }
    
    private makeNumbFrac():void
    {
        if (this.#isFrac)
            return;
        this.#stringValue+="."    
        this.#isFrac=true;
    }
    addDigit(digit:string):void
    {
        if (digit==".")
        {
            this.makeNumbFrac();
            return;
        }
        if (this.#stringValue=="0")
        {
            if (digit=="0")
                return;
            this.#stringValue=digit;
            return;    
        }
        this.#stringValue=this.#stringValue+digit;
    }  
    changeValue(value:string):void
    {
        this.#stringValue=value;
    }
    get numberValue():number
    {
        return +this.#stringValue
    }

    get stringValue():string
    {
        return this.#stringValue;
    }

    changePolarity():void
    {
        if (this.#stringValue=="0")
            return;
        if (this.#stringValue[0]=="-")
        {
            this.#stringValue=this.#stringValue.slice(1);
            return;
        }
        this.#stringValue="-"+this.#stringValue;
    }

    clear():void
    {
        this.#stringValue="0";
        this.#isFrac=false;
    }
}


const add:Function=(a:number, b:number):string => String(a+b);
const subtract:Function=(a:number,b:number):string=> String(a-b);
const divide:Function=(a:number,b:number):string=>String(a/b);
const multipy:Function=(a:number,b:number):string=>String(a*b);



class Calculator
{
    
    #onDisplay:string;
    #prevValue:calcNumb;
    #currValue:calcNumb;
    #currOp:calcOp;
    #isCurrVisible:boolean;
    #displayUpdateFunc:Function;


    constructor()
    {
        this.#prevValue=new calcNumb();
        this.#currValue=new calcNumb();
        this.#onDisplay=this.#prevValue.stringValue;
        this.#currOp=calcOp.None;
        this.#isCurrVisible=false; 
        this.#displayUpdateFunc=(a:string):string=>a;   
    }

    public onClickListener(button:Button):void
    {
        console.log("Кнопка с типом ",button.type);
        switch(button.type)
        {
            case action.Number:
                this.pushNumber(button.value);
                this.updateDisplay();
                break;
            case  action.Operator:
                this.pushOperator(button.value);
                this.updateDisplay();
                break;
            case action.Polarity:
                this.changePolarity();
                break;
            case action.Clear:
                this.clearAll();
                break;
            case action.Result:
                this.calcResult(); 
                break;
            default:
                throw new Error("Тип кнопки не определен");
        }
        this.updateDisplay();
    }
    public setDisplayUpdateFunc(func:Function)
    {
        this.#displayUpdateFunc=func;
    }

    private updateDisplay():void
    {
        if (this.#isCurrVisible==false || this.#currOp==calcOp.None)
        {
            this.#onDisplay=this.#prevValue.stringValue;
        }
        else
            this.#onDisplay=this.#prevValue.stringValue+" "+this.#currOp+" "+this.#currValue.stringValue;
        this.#displayUpdateFunc(this.#onDisplay);
    }

    private clearAll():void
    {
        this.#currValue.clear();
        this.#prevValue.clear();
        this.#isCurrVisible=true;
        this.#currOp=calcOp.None;
    }

    private clearCurr():void
    {
        this.#currValue.clear();
        this.#isCurrVisible=true;
    }

    private calcResult():void
    { 
        if (this.#currOp==calcOp.None)
            return;      
        switch(this.#currOp)
        {
            case calcOp.Plus:
                this.#prevValue.changeValue(add(this.#prevValue.numberValue,this.#currValue.numberValue));
                break;
            case calcOp.Minus:
                this.#prevValue.changeValue(subtract(this.#prevValue.numberValue,this.#currValue.numberValue));
                break;
            case calcOp.Mult:
                this.#prevValue.changeValue(multipy(this.#prevValue.numberValue,this.#currValue.numberValue));
                break;
            case calcOp.Div:
                this.#prevValue.changeValue(divide(this.#prevValue.numberValue,this.#currValue.numberValue));
                break;
            default:
                throw new Error("Невозможно выполнить операцию");
        }
        this.#isCurrVisible=false;
    }

    private pushNumber(value:string):void
    {
        if (!this.#isCurrVisible)// {numb1 (op numb2)}
            this.clearAll();
        if (this.#currOp==calcOp.None) // {numb1}
            this.#prevValue.addDigit(value);
        else // {numb1 op numb2}
            this.#currValue.addDigit(value);  
        if (value==".")
            console.log("point is pushed");
        else
            console.log("number is pushed");
    }

    private pushOperator(op:string):void
    {
        if (this.#currOp==calcOp.None || this.#currValue.stringValue=="0")// {numb1} or {numb1 op}
        {
            this.#currOp=<calcOp> op;
            return;
        }
        if (!this.#isCurrVisible)// {numb1 (op numb2)}
        {
            this.clearCurr();
            this.#currOp=<calcOp> op;
            return;
        }
        this.calcResult();// {numb1 op numb2}
        this.clearCurr();
        this.#currOp=<calcOp> op;
    }
    private changePolarity():void
    {
        if (!this.#isCurrVisible) // {numb2 or (numb1 op)}
        {
            this.clearCurr();
            this.#currOp=calcOp.None;
            this.#prevValue.changePolarity();
            return;
        }
        if (this.#currValue.stringValue=="0") // {numb1} or {numb1 op}
        {
            this.#prevValue.changePolarity();
            return;
        }
        else // {numb1 op  numb2}
            this.#currValue.changePolarity();
    }
   
}

export default Calculator;
