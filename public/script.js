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
        res.json()
            .then(function (json) {
                console.log(json);
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
            deleteBlogpostFromPage(json);
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
              var postTitle       = document.createElement('h2');
              var postText        = document.createElement('p');
              var postContainer   = document.querySelector('.post-container');
              var deleteButton    = document.createElement('button');
              var updateButton    = document.createElement('button');

              postText.innerHTML = arrayItem.blogpost;
              postTitle.innerHTML = arrayItem.title;
              updateButton.textContent = "update";
              deleteButton.textContent = "delete";
              postDiv.className = "post";
              postDiv.id = arrayItem.id;

              deleteButton.addEventListener('click', function (event) {
                  event.preventDefault();
                  var formData = new FormData();
                  formData.append('id', arrayItem.id);
                  deleteBlogpost('/delete-post', formData);
              });

              postDiv.appendChild(postTitle);
              postDiv.appendChild(postText);
              postDiv.appendChild(deleteButton);
              postDiv.appendChild(updateButton);
              postContainer.appendChild(postDiv);


          //}
      })
    //})
}

function deleteBlogpostFromPage (data) {
  var postDivToDelete = document.getElementById(data.id);
  postDivToDelete.remove();
}
