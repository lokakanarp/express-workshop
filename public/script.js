if (document.readyState !== 'loading') {
    ready();
} else {
    document.addEventListener('DOMContentLoaded', ready);
}

function ready () {
    getBlogposts('/get-posts');

    // send posts to server
    var form = document.querySelector('form');
    form.addEventListener('submit', function (event) {

        event.preventDefault(); // prevents the form from contacting our server automatically (we want to do it ourselves)
        var formActionUrl = form.action; // 'form.action' is the url '/create-post'
        var formData = new FormData(form);
        postBlogposts(formActionUrl, formData);
    });
}

/****
 * Function definitions
 ***/
function postBlogposts (url, data) {
    fetch(url, {
        method: 'POST',
        body: data
    })
    .then(function (res) {
      console.log(res)
        res.json()
            .then(function (json) {
                addBlogpostsToPage(json);
                document.querySelector('form').reset();
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

function deleteBlogpost(url, data) {
  fetch(url, {
      method: 'DELETE',
      body: data
  })
  .then(function (res) {
      res.json()
          .then(function (json) {
            console.log(json);
     })
  })
  .catch(function (err) {
      console.error(err)
  });
}

function addBlogpostsToPage (data) {

    data.forEach(function(arrayItem) {
      //for (var blogpost in arrayItem) {
          //if (arrayItem.hasOwnProperty(blogpost)) {

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


              deleteButton.addEventListener('click', function (event) {
                  event.preventDefault();
                  postDiv.remove();
                  deleteBlogpost('/delete-post', formData);
              });

              updateButton.addEventListener('click', function (event) {
                  event.preventDefault();
                  updateButton.remove();
                  createUpdateForm(postDiv.id, arrayItem.title, arrayItem.blogpost);
              });

              titleAndText.appendChild(postTitle);
              titleAndText.appendChild(postText);
              postDiv.appendChild(titleAndText);
              postDiv.appendChild(buttonContainer);
              buttonContainer.appendChild(deleteButton);
              buttonContainer.appendChild(updateButton);
              //postContainer.appendChild(postDiv);
              postContainer.insertBefore(postDiv, postContainer.childNodes[0]);


          //}
      })
    //})
}

function createUpdateForm(id, title, postText) {
  var updateDiv = document.createElement('div');
  updateDiv.className = "update-container";
  var updateForm = document.createElement("form");
  updateForm.setAttribute("class", "updateForm");
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
  document.getElementById(id).appendChild(updateDiv);
}
