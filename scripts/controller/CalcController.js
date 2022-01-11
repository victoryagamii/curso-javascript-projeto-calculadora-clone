class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipBoard() {

        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        }); 

    } //função colar do teclado

    copyToClipboard() {

        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

    } //função copiar do teclado

    initialize() {

        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            });
        });

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    } //ativar desativar -  audio

    playAudio() {

        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }

    } //tocar o audio das teclas

    initKeyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '+':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });

    } // usar teclado na calculado

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });

    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }// função apagar tudo CA

    clearEntry() {

        this._operation.pop();
        this.setLastNumberToDisplay();

    } // limpar entrada CE

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    } //pegar ultima conta feita

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;

    } //setar ultima conta

    isOperator(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    } //operadores 

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }

    }

    getResult() {

        try{
        return eval(this._operation.join(""));
        } catch(e){
            setTimeout(()=>{
            this.setError();
            },1);
        }

    }

    calc() {

        let last = '';
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length === 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last === '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if (last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();

    } //função de calcular

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) === isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    } //pegar ultimo operador

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;

    } //ultimo numero mostrado

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }

    } // função com os operadores

    setError() {
        this.displayCalc = "Error";
    } // notificação de erro

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.setLastOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    } //numeros irracionais

    execBtn(value) {

        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }

    } //botoes

    initButtonsEvents() {

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });

    } //clique , imagem efeito

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    } //mostrar a data hora

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        
        if(value.toString().length >10){
            this.setError();
            return;
        }

        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        return this._currentDate = value;
    }
}