const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventListeners();

    //tum event listenerlar
function eventListeners(){
    form.addEventListener("submit",addTodo);
    
    //bu bize localStorage dan sayfa yuklendigin de almamizi saglar loadAllTodoUI fonksiyonuyla
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);

    //secondCardBody e basildigonda silme islemi icin
    //nereye tiklandigi belli zaten mesela x isaretine tiklanan
    //elementinin className mine gore islem yapiyoruz
    secondCardBody.addEventListener("click",deleteTodo);

    //filter etmek icin 
    filter.addEventListener("keyup",filterTodos);

    //silme islemi Tum tasklari temizle butonu
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){
    //butona basildiginda confirm kontrolu ustte acilan alert gibi kontrol
    if(confirm("Tumunu silmek isteginize emin misiniz ?"))
    {
        // Arayuzden Todolari temizleme
        //todoList.innerHTML = ""; //yavas yontem
        //firstElementChild ilk elemani verir
        //elemanlar tamamen silinince null olur firstElementChild
        while(todoList.firstElementChild != null){
            //kac tane eleman  varsa first eleamnini siler ve en son kalmayinca null ile sonlanir
            //arayuzden sildik localde duruyor
            todoList.removeChild(todoList.firstElementChild);
        }
        //localden key anahtarimiza gore todolari sildik
        localStorage.removeItem("todos");
        

    }
    

}

function filterTodos(e){
    //hepsini kucuk harfe cevirdik
    const filterValue = e.target.value.toLowerCase();
    //sadece li lerimizi aldik
    const listItems = document.querySelectorAll(".list-group-item");
    
    //li lerin uzerinde tek tek gezinmek icin
    listItems.forEach(function(listItem){
            //texi aldik
            const text = listItem.textContent.toLowerCase();
            if(text.indexOf(filterValue) === -1){
                //-1 ise bulamadi demektir
                //css ozelligi ekledik ve display none diyerek sayfada gosterme demis olduk
                //!important ise bootstrap ozelligini kullanma benim yazdigimi kullan dedik ve botstrap deki ozelligi iptal etmis olduk
                listItem.setAttribute("style","display : none !important");
            }else{
                listItem.setAttribute("style","display : block")
            }
        });
    
    
    console.log(e.target.value);
}

function deleteTodo(e){
    //silme icin fa fa-remove classi olan x butonu aslinda

    if(e.target.className === "fa fa-remove"){
        //mesela bu x butonuna tiklamayi aldik ancak todomuz 2 ust class bulunuyor cercevesi falan
        //bunlarida toplam silmek icin bu cardbody icindeki elementleri kaldirmamiz gerekiyor
        e.target.parentElement.parentElement.remove();
        
        //burada li elementini gonderirsek hangi todoya gore silindiyse storage den de silebiliriz
        //text contenti gonderirsek todomuzun adini gonderiyoruz
        deletTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo Basariyla Kaldirildi..");

    }
}
function deletTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if (todo === deletetodo )   
            {   //splice metodu bize verilen indexi arraydan silmemizi saglar
                todos.splice(index,1);
            }
    });
    //tekrardan localStorage a silinen degerler sonrasi
    localStorage.setItem("todos",JSON.stringify(todos));

}


function loadAllTodosToUI(){
    //storage den todolari almak icin getTodosFromStorage kullaniyoruz

    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
        //localStorage dan gelen todos lari forEach 
        //yardimiyla aslinda bastiriyoruz yine addTodoToUI fonksiyonuyla
    })

}




function addTodo(e){

    //inputtaki degerleri alma
    const newTodo = todoInput.value.trim();
    console.log(newTodo);
    
    if (newTodo === "")
    {   /*<div class="alert alert-primary" role="alert">
    This is a primary alert—check it out!
  </div> */
        showAlert("danger","Lutfen Bir Todo Girin");
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","ToDo Basariyla eklendi")
    }
 //Bu bize form tekrardan sayfaya yonlendirmesini onluyoruz
    e.preventDefault();
}

function getTodosFromStorage(){//storage dan butun todolari almis olur
    let todos;

    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else{
        todos =JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));
    
}

function showAlert(type,message){
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

    //setTimeOut methodu 
    setTimeout(function(){ //bu bize 1 saniye sonra bu fonksiyon calisacak ve alertimiz silinecek
        alert.remove();
    },1000);

    console.log(alert);
}



//arayuze bu newTodo yu listItem olarak ekleyecek
function addTodoToUI(newTodo){
    /*    <!-- <li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>-->*/

//list item olusturma
   const listItem = document.createElement("li");
// Link olusturma
   const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";
   
   
    listItem.className = "list-group-item d-flex justify-content-between";

    // Text Node Ekleme newTOdo yu araya Ekledik
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo liste list Itemi Ekleme

    todoList.appendChild(listItem);

    todoInput.value = "";
    console.log(listItem);

  
}