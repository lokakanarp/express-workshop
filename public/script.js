if (document.readyState !== 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

function ready () {
    getBlogposts('/get-posts');

    var form = document.querySelector('.entry-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var formActionUrl = form.action; // 'form.action' is the url '/create-post'
        var formData = new FormData(form);
        postBlogposts(formActionUrl, formData);
    });
}

function postBlogposts (url, data) {
    fetch(url, {
        method: 'POST',
        body: data
    })
    .then(function (res) {
        res.json()
            .then(function (json) {
              console.log(json)
                addBlogpostsToPage(json);
                document.querySelector('form').reset();
        })
    })
    .catch(function (err) {
        console.error(err)
    });
}

function sendUpdatedBlogpost (url, data) {
    fetch(url, {
        method: 'POST',
        body: data
    })
    .then(function (res) {
        res.json()
            .then(function (json) {
              location.reload();
        })
    })
    .catch(function (err) {
        console.error(err)
    });
}

function getBlogposts (url) {
    fetch(url, {
        method: 'GET'
    })
    .then(function (res) {
        res.json()
        .then(function (json) {
            addBlogpostsToPage(json);
        });
    })
    .catch(function (err) {
        console.error(err)
    });
}

function getSingleBlogpost (url) {
    fetch(url, {
        method: 'GET'
    })
    .then(function (res) {
        res.json()
        .then(function (json) {
          addSingleBlogpostToPage(json);
            //addBlogpostsToPage(json);
        });
    })
    .catch(function (err) {
        console.error(err)
    });
}

function deleteBlogpost(url, data, id) {
  var postToDelete = document.getElementById(id);
  postToDelete.style.opacity = '0.5';
  fetch(url, {
      method: 'DELETE',
      body: data
  })
  .then(function (res) {
      res.json()
          .then(function (json) {
            postToDelete.remove();
     })
  })
  .catch(function (err) {
      console.error(err)
  });
}

function addBlogpostsToPage (data) {

  data.forEach(function(arrayItem) {
    var postDiv         = document.createElement('div');
    var titleAndText    = document.createElement('div');
    var postTitle       = document.createElement('h2');
    var postText        = document.createElement('p');
    var postContainer   = document.querySelector('.post-container');
    var buttonContainer = document.createElement('div');
    var deleteButton    = document.createElement('button');
    var updateButton    = document.createElement('button');

    postText.innerHTML = arrayItem.blogpost;
    postTitle.innerHTML = arrayItem.title;
    buttonContainer.className = "button-container";
    updateButton.textContent = "edit";
    deleteButton.textContent = "delete";
    postDiv.className = "post";
    postDiv.id = arrayItem.id;

    var formData = new FormData();
    formData.append('id', arrayItem.id);

    // postTitle.addEventListener('click', function (event) {
    //   event.preventDefault();
    //   getSingleBlogpost('/posts/' + arrayItem.id);
    // })

    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();
        deleteBlogpost('/delete-post', formData, arrayItem.id);
    });

    updateButton.addEventListener('click', function (event) {
        event.preventDefault();
        updateButton.remove();
        createUpdateForm(postDiv.id, arrayItem.title, arrayItem.blogpost, arrayItem.date);
    });

    titleAndText.appendChild(postTitle);
    titleAndText.appendChild(postText);
    postDiv.appendChild(titleAndText);
    postDiv.appendChild(buttonContainer);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(updateButton);
    //postContainer.appendChild(postDiv);
    postContainer.insertBefore(postDiv, postContainer.childNodes[0]);
  })
}

function addSingleBlogpostToPage (data) {
  data.forEach(function(arrayItem) {
    var postDiv         = document.createElement('div');
    var titleAndText    = document.createElement('div');
    var postTitle       = document.createElement('h2');
    var postText        = document.createElement('p');
    var postContainer   = document.querySelector('.post-container');
    var buttonContainer = document.createElement('div');
    var deleteButton    = document.createElement('button');
    var updateButton    = document.createElement('button');

    postText.innerHTML = arrayItem.blogpost;
    postTitle.innerHTML = arrayItem.title;
    buttonContainer.className = "button-container";
    updateButton.textContent = "edit";
    deleteButton.textContent = "delete";
    postDiv.className = "post";
    postDiv.id = arrayItem.id;

    var formData = new FormData();
    formData.append('id', arrayItem.id);

    postTitle.addEventListener('click', function (event) {
      event.preventDefault();
      getSingleBlogpost('/posts/' + arrayItem.id);
    })

    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();
        deleteBlogpost('/delete-post', formData, arrayItem.id);
    });

    updateButton.addEventListener('click', function (event) {
        event.preventDefault();
        updateButton.remove();
        createUpdateForm(postDiv.id, arrayItem.title, arrayItem.blogpost, arrayItem.date);
    });

    titleAndText.appendChild(postTitle);
    titleAndText.appendChild(postText);
    postDiv.appendChild(titleAndText);
    postDiv.appendChild(buttonContainer);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(updateButton);
    //postContainer.appendChild(postDiv);
    postContainer.innerHTML = '';
    postContainer.appendChild(postDiv);
  })
}

function createUpdateForm(id, title, postText, date) {
  var updateDiv = document.createElement('div');
  updateDiv.className = "update-container";
  var updateForm = document.createElement("form");
  updateForm.setAttribute("class", "updateForm");
  updateForm.setAttribute("action", "/update-post");
  updateForm.setAttribute("method", "POST");
  updateDiv.appendChild(updateForm);

  var updateTitle = document.createElement("textarea");
  updateTitle.setAttribute("name", "title");
  updateTitle.setAttribute("rows", "1");
  updateTitle.innerHTML = title;
  updateForm.appendChild(updateTitle);

  var updateBlogpost = document.createElement("textarea");
  updateBlogpost.setAttribute("name", "blogpost");
  updateBlogpost.setAttribute("rows", "5");
  updateBlogpost.innerHTML = postText;
  updateForm.appendChild(updateBlogpost);

  var sendUpdateButton = document.createElement('button');
  sendUpdateButton.textContent = "send";

  sendUpdateButton.addEventListener('click', function(event) {
    event.preventDefault();
    var formActionUrl = updateForm.action;
    var formData = new FormData(updateForm);
    formData.append('id', id);
    sendUpdatedBlogpost(formActionUrl, formData);

  });

  updateForm.appendChild(sendUpdateButton);


  document.getElementById(id).appendChild(updateDiv);
}
