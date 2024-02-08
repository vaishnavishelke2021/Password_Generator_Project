
const passwordDisplay = document.querySelector("[data-passwordDisplay]");    // access custom attribute
const copybtn = document.querySelector('#copybtn');

const lengthDisplay = document.querySelector('.lengthDisplay');
const copymsg = document.querySelector('.copymsg');
const range = document.querySelector('#range');
const upperCase = document.querySelector('#upperCase');
const lowerCase = document.querySelector('#lowerCase');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');

const indicator = document.querySelector('.indicator');
const btn = document.querySelector('#btn');
const allcheckbox = document.querySelectorAll('input[type=checkbox]');

let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbolsStr = "~!@#$%^&*()_+{}[]-=\|`,<.>/?";


handleRange();
// set password length 
function handleRange(){
    range.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 5px ${color}`
}

// random number generator function 
function getRandomInt(min, max){
    return Math.floor(Math.random()* (max-min)) + min;
}

function generateRandumNumber(){
    return getRandomInt(0,9);
}

// convert number to character : String.fromCharCode()
function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,91));   //ascii value for A-Z              
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,123));   //ascii value for a-z
}

function generateSymbols(){
    const randsym = getRandomInt(0, symbolsStr.length);
    return symbolsStr.charAt(randsym);
}

// TO Calculate strength 
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(upperCase.checked) hasUpper=true;
    if(lowerCase.checked) hasLower=true;
    if(numbers.checked) hasNum=true;
    if(symbols.checked) hasSymbol=true;

    if( hasUpper && hasLower && (hasNum || hasSymbol) && password.length>=8){
        setIndicator("#0f0");
    }else{
        setIndicator("#f00")
    }
}


// to copy content to clipboard 
async function copyContent(){
    try{
        // navigator.clipboard.writeText <= method to copy text on clipboard, it returns a promise 
        await navigator.clipboard.writeText(passwordDisplay.value);  //wait until msg copied
        copymsg.innerHTML = 'copied';                                // after promise fulfilled
    }
    catch(e){
        copymsg.innerHTML = 'failed';                                // if promise failed/rejected
    }

    copymsg.classList.add("active");                                 //visible copy msg

    setTimeout(() => {                                               // remove copymsg after 2 sec
        copymsg.classList.remove("active");
    }, 1000);                       
}


// to shuffle Password 
function shufflePassword(array){
    // fisher yates method (to shuffle an array)
    for(let i=(array.length)-1; i>1; i--){
        const j = Math.floor(Math.random()* (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((elm) => (str+=elm));
    return str;
}


function handleCheckboxChange(){
    checkCount = 0;
    allcheckbox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    // special condition 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleRange();
    }
}
// addEventListener on all checkbox
allcheckbox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckboxChange);
})


// addEventListener on range/slider 
range.addEventListener('input', (e)=> {
    passwordLength = e.target.value;
    handleRange();
})

// addEventListener on copybtn 
copybtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
        copyContent();

    // console.log('copied');
    
})

// addEventListener on generate btn 
btn.addEventListener('click', ()=> {

    if(checkCount == 0) 
    return;                       //if none of the checkbox are selected

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleRange();
    }

    // remove old password 
    password = "";

    let funcArr = [];

    if(upperCase.checked)
        funcArr.push(generateUpperCase);
    if(lowerCase.checked)
        funcArr.push(generateLowerCase);
    if(numbers.checked)
        funcArr.push(generateRandumNumber);
    if(symbols.checked)
        funcArr.push(generateSymbols);


    // compulsory addition 
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
 
    console.log('c add done');

    // remaining addition 
    for(let i=0; i<(passwordLength-funcArr.length); i++){
        let randIndex = getRandomInt(0, funcArr.length);
        console.log('randomindex');
        password += funcArr[randIndex]();
    }

    console.log('r add done');

    // shuffle password 
    password = shufflePassword(Array.from(password));
    console.log('shuffle done');

    // show password 
    passwordDisplay.value = password;
    calcStrength();
});
