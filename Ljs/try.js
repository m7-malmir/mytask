// console.log('hello world');
// console.error('this is an error');
// console.warn('this is a warning');

 //var , let , const

//  var age=29;
// age=30;
 //console.log(age);

 // string, numbers, null, undefined
//  const name='john';
//  const age=30;
//  const rating=4.5;
//  const isCool=true;
//  const x= null;
//  const y=undefined;
//  let z;

//  console.log(typeof name);

// const name='john';
// const age=30;
//concatenation
//console.log('my name is:'+name+' and my age is:'+age);

//template string
// const Hi=`my name is ${name} and i am ${age} years old`;
// console.log(Hi);

// const s='hello world';
// const words='mohammad, ali, sara';
// console.log(s.toUpperCase());
// console.log(s.substring(0,6).toUpperCase());
// console.log(words.split(','));

//arrays
/* variables that holds multiple value*/ 
// const numbers=new Array(1,2,3,4);
// console.log(numbers);
// const fruits=['banana','apple','orange'];
// fruits[5]='grapes';
// fruits.push('mangos');
// fruits.unshift('peanapple');
// fruits.pop();
// console.log(Array.isArray(fruits));
// console.log(fruits.indexOf('grapes'));
// console.log(fruits);

// const person={
//     firstName:'mohammad',
//     lastName:'malmir',
//     age:30,
//     hobbies:['music','book','code'],
//     address:{
//         street:'50 main st',
//         city: 'Navan',
//         state: 'MA'
//     }
// }
// console.log(person.firstName , person.lastName);
//  console.log(person.address.city);
//  const {firstName,lastName,address:{city}}=person;
//person.email='m.malmir@gmail.com';
// console.log(city);

// const todos=[
//     {
//         id:1,
//         text:'Take out trash',
//         isCompleted:true
//     },
//     {
//         id:2,
//         text:'get ticket ',
//         isCompleted:false
//     },
//     {
//         id:3,
//         text:'do the lundry',
//         isCompleted:false
//     }
// ];
// console.log(todos[1].text);

// const todoJSON=JSON.stringify(todos);
// console.log(todoJSON);


// Loops
// for(let i=0;i < 9;i++){
//     console.log(`For loop number: ${i}`);
// }
// let i=0;
// while(i<10){
//     console.log(`while loop number: ${i}`);  
//     i++;
// }

// for (let i = 0; i < todos.length; i++) {
//    console.log(todos[i].text);
// }
// for(let todo of todos){
//     console.log(todo.text);
// }

//foreach , map, filter
//todos.forEach(function(todo){
    //console.log(todo.text);
//});
// const todoText = todos.map(function(todo){
//     return todo.text;
// });

// console.log(todoText); //return regular array
// const todoFilter = todos.filter(function(todo){
//     return todo.isCompleted===false;
// }).map(function(todo){
//     return todo.text;
// });//Manipulate array

// console.log(todoFilter); //return regular array

/* conditions  */

const x='10';
//x>10 ? console.log('g t 10') :  console.log('l t 10');
// if (x>10) {
//     console.log('x great than 10');
// }else{
//     console.log('x less than 10');
// }

// function sum(num1,num2){
//     return  num1+num2;
// }
// const sum = (num1,num2)=>{return num1+num2}
// console.log(sum(2,3));


// constructor function
// function Person(firstName,lastName,dob){
//     this.firstName=firstName;
//     this.lastName=lastName;
//     this.dob=dob;
// }
// Person.prototype.getBirthYear=function () {
//     return `${this.firstName} ${this.lastName}`;
// }
//class ES6
// class Person{
//     constructor(firstName,lastName,dob){
//         this.firstName=firstName;
//         this.lastName=lastName;
//         this.dob=dob;  
//     }
//     getBirthYear(){
//         return `${this.dob}`;
//     }
// }

// //Instantiate object
// const person1=new Person('ali','malmir','18-06-1991');
// const person2=new Person('mohammad','azizi','28-04-2008');
// console.log(person1.getBirthYear());
// console.log(person1);


//DOM

// single elements
// const form=document.getElementById('my-form');
// const form2=document.querySelector('.container');
// console.log(form2);


// multiple element
// console.log(document.querySelectorAll('.item'));
// console.log(document.getElementsByClassName('item'));
//console.log(document.getElementsByTagName('li'));


const myForm=document.querySelector('#my-form');
const nameInput=document.querySelector('#name');
const emailInput=document.querySelector('#email');
const msg=document.querySelector('.msg');
const userList=document.querySelector('#users');

myForm.addEventListener('submit',onsubmit);

function onsubmit(e) {
    e.preventDefault();
    if (nameInput.value==='' || emailInput.value==='') {
        msg.classList.add('error');
        msg.innerHTML='please enter all fields';
        setTimeout(()=>msg.remove(),3000);

    }else{
       const li=document.createElement('li');
       li.appendChild(document.createTextNode(`${nameInput.value} : ${emailInput.value}`));
       userList.appendChild(li);
       //clear filed
       nameInput='';
       emailInput='';
    }
}
//console.log(typeof null);





