const blogGrid = document.getElementById("blogGrid");
const search = document.getElementById("search");
const category = document.getElementById("category");
const darkBtn = document.getElementById("darkBtn");

if(blogGrid){

displayBlogs(blogs);

search.addEventListener("keyup",filterBlogs);

category.addEventListener("change",filterBlogs);

}

function displayBlogs(data){

blogGrid.innerHTML="";

data.forEach(blog=>{

blogGrid.innerHTML+=`

<div class="blog-card">

<img src="${blog.image}">

<div class="blog-info">

<span>${blog.category}</span>

<h3>${blog.title}</h3>

<p>${blog.description}</p>

<div class="bottom">

<small>${blog.author}</small>

<a href="blog.html">

<button>

Read More

</button>

</a>

</div>

</div>

</div>

`;

});

}

function filterBlogs(){

let keyword=search.value.toLowerCase();

let selected=category.value;

let filtered=blogs.filter(blog=>{

let matchTitle=blog.title.toLowerCase().includes(keyword);

let matchCategory=selected==="all" || blog.category===selected;

return matchTitle && matchCategory;

});

displayBlogs(filtered);

}

if(darkBtn){

darkBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});

}

const likeBtn=document.getElementById("likeBtn");

const likes=document.getElementById("likes");

let likeCount=localStorage.getItem("likes") || 0;

if(likes){

likes.innerText=likeCount+" Likes";

}

if(likeBtn){

likeBtn.onclick=()=>{

likeCount++;

likes.innerText=likeCount+" Likes";

localStorage.setItem("likes",likeCount);

};

}

const commentForm=document.getElementById("commentForm");

const commentList=document.getElementById("commentList");

let comments=JSON.parse(localStorage.getItem("comments")) || [];

function loadComments(){

if(!commentList) return;

commentList.innerHTML="";

comments.forEach(c=>{

commentList.innerHTML+=`

<div class="comment">

<h4>${c.name}</h4>

<p>${c.comment}</p>

</div>

`;

});

}

loadComments();

if(commentForm){

commentForm.addEventListener("submit",(e)=>{

e.preventDefault();

const name=document.getElementById("name").value;

const comment=document.getElementById("comment").value;

comments.push({

name,

comment

});

localStorage.setItem("comments",JSON.stringify(comments));

commentForm.reset();

loadComments();

});

}