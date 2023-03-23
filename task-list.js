'use strict';

//各HTML要素への参照を取得
const month = document.getElementById('select-month');
const selectProgress = document.getElementById('select-progress');
const formText = document.getElementById('form-task-title');
const formTextarea = document.getElementById('form-task-summary');
const table = document.getElementById('task-table');

//N予備校の課題の通り、タスクの保持は配列で行うようにする
let taskList = [];

//コードを見やすくするため、ローカルストレージを変数化しておく
const storage = localStorage;

//ローカルストレージから保存されているタスクの取り出し → 取り出したタスクをテーブル表示、をページ表示時に実行
getStorage();



//タスクを登録＆保持する処理
function registerTask(){

    //N予備校の課題の通り、ひとつひとつのタスクの詳細はオブジェクトにて保持する
    const task = { month:month.value, selectProgress:selectProgress.value, formText:formText.value, formTextarea:formTextarea.value };

    //同じタスクを連続で登録できないようにする(課題にはないが、あると便利なので追加)
    if (taskList[taskList.length - 1]){  //念のため、配列taskListが空の時は実施しないようにする
        const sameCheck = taskList[taskList.length - 1];
        if (JSON.stringify(task) === JSON.stringify(sameCheck)) {  //オブジェクトを直接比較すると、アドレス番地の比較になってしまうので、今回はJSON化してから比較する
            return;
        };
    };
    
    //タスクを格納する配列に追加(配列の末尾に追加される)
    taskList.push(task);

    //課題で指定されている通り、表示し直しのため、現在テーブル表示されているタスク一覧は一旦削除
    //最終行削除を繰り返す
    //(前回表示したものなので、配列の要素数はひとつ少ない分、-1しておく)
    for (let i = 0; i < taskList.length - 1; i++){
        table.deleteRow(-1);
    };

    //タスクをテーブル表示する関数を呼び出す
    createTaskListTable();
};



//タスク一覧から、タスクを削除する処理
//引数は削除ボタンのvalue属性の値
function deleteTask(num){

    //課題で指定されている通り、表示し直しのため、現在テーブル表示されているタスク一覧は一旦削除
    //最終行削除を繰り返す
    for (let i = 0; i < taskList.length; i++){
        table.deleteRow(-1);
    };
    
    //taskList配列から要素を削除
    taskList.splice(num, 1);

    //タスクをテーブル表示する関数を呼び出す
    createTaskListTable();
};



//タスク一覧を表示するテーブルを作成する
function createTaskListTable() {

    //タスクをテーブルに表示していく（テーブル内の行としては2行目から追加していくので注意）
    for(let i = 0; i < taskList.length; i++){

        //タスク表示用として、テーブルの最後の行の後に新規行(tr要素)を追加し、そこにセル(td要素)も追加していく
        let newRow = table.insertRow(-1);
        let cellMonth = newRow.insertCell(0);
        let cellSelectProgress = newRow.insertCell(1);
        let cellFormText = newRow.insertCell(2);
        let cellFormTextarea = newRow.insertCell(3);
        let cellDeleteButton = newRow.insertCell(4);

        //削除用ボタンの作成(何行目かを示す属性とonclick属性も追加しておく)
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '削除';
        deleteButton.setAttribute('value', i);  //ここでのiが、taskList配列内のタスクのインデックスと同じ値になる
        deleteButton.setAttribute('onclick', 'deleteTask(value)');  //value属性とid属性は、onclickにセットした関数に引数として渡せる(今回はvalueで渡す)

        //テーブルのセル内に値を追加＆表示していく
        cellMonth.appendChild(document.createTextNode(taskList[i].month));
        cellSelectProgress.appendChild(document.createTextNode(taskList[i].selectProgress));
        cellFormText.appendChild(document.createTextNode(taskList[i].formText));
        cellFormTextarea.appendChild(document.createTextNode(taskList[i].formTextarea));
        cellDeleteButton.appendChild(deleteButton);  
    };

    //タスクをローカルストレージに保存
    setStorage();
};



//各タスクをローカルストレージに格納していく
//オブジェクトはローカルストレージに直接格納できないので、一旦JSON化してから格納するようにする
//WebStorage内に保存できるのは文字列のみ、と捉えるべき
function setStorage(){
    for(let i = 0; i < taskList.length; i++){
        let task = `task${i}`;
        storage[task] = JSON.stringify(taskList[i]);
    };
};



//ローカルストレージからデータを取り出し、taskListに追加
//そして、ローカルストレージから取り出したタスクをテーブル表示する
function getStorage(){

    let i = 0;

    while(storage[`task${i}`]){
        const task = JSON.parse(storage[`task${i}`]);  //JSONをオブジェクト化する
        taskList.push(task);
        i++
    };

    //タスクをテーブル表示する関数を呼び出す
    createTaskListTable();
};
