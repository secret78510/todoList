
(function () {
  document.querySelector('.todo-btn').addEventListener('click', addTodo);
  document.querySelector('.todo-input input').addEventListener('keydown', () => {
    if(event.keyCode === 13){
      addTodo();
    }
  });
  document.querySelector('.todo-content').addEventListener('click', removeTodo);
  document.querySelector('.todo-content').addEventListener('click', checkboxStatus);
  document.querySelectorAll('.todo-status li').forEach((item) => {
    item.addEventListener('click', updateTitle);
  })
  todoView();
  taskView();
})();

function addTodo() {
  const txt = document.querySelector('.todo-input input');
  const data =JSON.parse(localStorage.getItem('todoData')) || [];;
  //避免空值傳入
  if(!txt.value){return}
  const timestamp = Date.now();
  const todo = {
    txt: txt.value.trim(),
    status:false,
    timestamp,
  }
  data.push(todo);
  localStorage.setItem('todoData',JSON.stringify(data));
  todoView();
  const todoContentLi = document.querySelectorAll('.todo-content li');
  //預設為全部
  updateTitle('all')
  confirmTitle()
  taskView(todoContentLi.length,'all active');
  txt.value = '';
}
function removeTodo() {
  const data =JSON.parse(localStorage.getItem('todoData')) || [];
  //避免點到父層
  if(event.target.nodeName !== 'A'){return}
  //將data的值字串後才能比對
  const timestampIndex = data.findIndex((item) => item.timestamp.toString() === event.target.dataset.index)
  data.splice(timestampIndex, 1);
  localStorage.setItem('todoData',JSON.stringify(data));
  todoView();
  confirmTitle();
}

function checkboxStatus() {
  const todoContentLi = document.querySelectorAll('.todo-content li');
  const data =JSON.parse(localStorage.getItem('todoData'));
  //當todo的checkbox狀態改變的同時 找到localStorage裡面一樣的值一起改變
  todoContentLi.forEach((li) => {
    data.forEach((item) => {
      if(li.children[0].checked === true && 
        item.timestamp.toString() === li.children[1].dataset.index){
        item.status = true;
      } else if (li.children[0].checked === false &&
        item.timestamp.toString() === li.children[1].dataset.index){
        item.status = false;
      }
    })
  })
  localStorage.setItem('todoData',JSON.stringify(data));
  confirmTitle();
}
//當chechbox被打勾時 或元素消失時 從新跑一次確定title的active
function confirmTitle() {
  const todoStatusLi = document.querySelectorAll('.todo-status li');
  todoStatusLi.forEach((item) => {
    if(item.className === 'all active'){
      updateTodo('all active')
    } else if(item.className === 'ing active'){
      updateTodo('ing active')
    } else if(item.className === 'end active'){
      updateTodo('end active')
    }
  })
}
//畫面
function updateTitle(status) {
  const todoStatusLi = document.querySelectorAll('.todo-status li');
  todoStatusLi.forEach((item) => {
    item.classList.remove('active')
  });
  todoStatusLi.forEach((item) => {
    if(event.target.className === item.className ||
      status === item.className){
      item.classList.add('active')
    }
  });
  if(event.target.className) { 
    updateTodo(event.target.className);
  }
}

function updateTodo(status){
  const todoContentLi = document.querySelectorAll('.todo-content li');
  const todoContent = document.querySelector('.todo-content');
  let num = 0;
  let i =0;
  todoContentLi.forEach((item) => {
    item.style.display = 'none'
  })
  //使用forEach 或for迴圈 當回收最後一個元素則為0 則迴圈不會再跑 觸發不了taskView改變狀態
  //使用do迴圈至少跑一次 避免任務回報顯示數量不同
  do{
    switch (status) {
      case 'all active': 
      console.log(todoContent.firstChild)
        if(todoContent.hasChildNodes()){
          todoContentLi[i].style.display ='block';
        }
        taskView(todoContentLi.length, 'all active');
        break;
      case 'ing active':
        if(todoContent.hasChildNodes() && !todoContentLi[i].children[0].checked){
            todoContentLi[i].style.display ='block';
            num += 1;
        }
        taskView(num, 'ing active');
        break;
      case 'end active':
        if(todoContent.hasChildNodes() && todoContentLi[i].children[0].checked){
          todoContentLi[i].style.display ='block';
          num += 1;
        }
        taskView(num, 'end active');
        break
      default: 
        break;
    }
    i++
  }
  while(i < todoContentLi.length)
}
function todoView(){
  const todoContent = document.querySelector('.todo-content');
  const data = JSON.parse(localStorage.getItem('todoData')) || [];
  while(todoContent.hasChildNodes()) {
    todoContent.removeChild(todoContent.childNodes[0]);
  }
  data.forEach((item, index) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const checkbox = document.createElement('input');
    const txt= document.createTextNode(' '+(index+1)+'.'+item.txt);
    checkbox.type = 'checkbox';
    checkbox.checked = item.status;
    todoContent.appendChild(li);
    li.appendChild(checkbox);
    li.appendChild(txt)
    li.appendChild(a);
    a.href='#';
    a.className = 'fas fa-times';
    a.dataset.index = item.timestamp;
  })
  localStorage.setItem('todoData',JSON.stringify(data));
}

function taskView(num, status){
  const task = document.querySelector('.todo-task');
  const todoContentLi = document.querySelectorAll('.todo-content li');
  if (status === 'all active') {
    task.textContent = `全部有${num}筆任務`;
  } else if(status === 'ing active') {
    task.textContent = `進行中有${num}筆任務`;
  }else if(status === 'end active') {
    task.textContent = `完成有${num}筆任務`;
  } else {
    task.textContent = `全部有${todoContentLi.length}筆任務`;
  }
}
