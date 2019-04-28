$(document).ready(() => {
    $.getJSON('/articles', (data) => {
        if (data.length > 0) {
          $('#articles').empty();
          for (let i = 0; i < data.length; i++) {
            const article = renderArticleHome(data[i]);
            $('#articles').append(article);
          }
        }
    });

    function renderArticleHome(data: { image: any; _id: any; link: any; title: any }) {
        const article = $('<div>').addClass('article')
          .html(`
      <div class="card" style="width: 18rem;">
        <img src=${data.image} class="card-img-top" alt="...">
        <i class="fas fa-cloud-download-alt save fa-2x" data-id=${data._id}></i>
        <div class="card-body">
          <a href=${data.link} target='_blank'><p class="card-text">${data.title}</p></a>
        </div>
      </div>
      `);
        return article;
    }

    function renderSaved(data: { image: any; _id: any; link: any; title: any }) {
        const article = $('<div>').addClass('article')
          .html(`
      <div class="card" style="width: 18rem;">
        <img src=${data.image} class="card-img-top" alt="...">
        
          <i class="fas fa-clipboard note fa-2x" data-id=${
  data._id
} class="noteButton" type="button" data-toggle="modal" data-target="#exampleModalCenter"></i>
        
        <i class="fas fa-minus-circle delete fa-2x" data-id=${data._id}></i>
        <div class="card-body">
          <a href=${data.link} target='_blank'><p class="card-text">${data.title}</p></a>
        </div>
      </div>
      `);
        return article;
    }

    $('#scrape').on('click', () => {
        $.ajax({
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: '/scrape'
        }).then((data) => {
            console.log(`Scraped:\n${data}`);
            $.getJSON('/articles', (data) => {
                if (data.length > 0) {
                  $('#articles').empty();
                  for (let i = 0; i < data.length; i++) {
                    const article = renderArticleHome(data[i]);
                    $('#articles').append(article);
                  }
                }
            });
        });
    });

    $('#saved').on('click', () => {
        $.ajax({
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: '/saved'
        }).then((data) => {
            $('#articles').empty();
            for (let i = 0; i < data.length; i++) {
              const article = renderSaved(data[i]);
              $('#articles').append(article);
            }
        });
    });

    $('#clear').on('click', () => {
        $.ajax({
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: '/clear'
        }).then((res) => {
            $('#articles').html("There's nothing in here.");
        });
    });

    $('#home').on('click', () => {
        $.getJSON('/articles', (data) => {
            if (data.length > 0) {
              $('#articles').empty();
              for (let i = 0; i < data.length; i++) {
                const article = renderArticleHome(data[i]);
                $('#articles').append(article);
              }
            }
        });
    });

    $(document).on('click', '.save', function () {
        const selected = $(this);
        $.ajax({
            type: 'POST',
            url: `/save/${selected.attr('data-id')}`,
            headers: { 'Access-Control-Allow-Origin': '*' },
            dataType: 'json',
            data: {
                saved: true
            },
            success: (data) => {
                console.log(`Saved:\n${data}`);
            }
        });
    });

    $(document).on('click', 'p', function () {
        $('#notes').empty();
        const thisId = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: `/articles/${thisId}`
        }).then((data) => {
            $('#notes').append(`<h2>${data.title}</h2>`);
            $('#notes').append("<input id='titleinput' name='title' >");
            $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
            $('#notes').append(`<button data-id='${data._id}' id='savenote'>Save Note</button>`);
            if (data.note) {
              $('#titleinput').val(data.note.title);
              $('#bodyinput').val(data.note.body);
            }
        });
    });

    $(document).on('click', '#savenote', function () {
        const thisId = $(this).attr('data-id');
        $.ajax({
            method: 'POST',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: `/articles/${thisId}`,
            data: {
                title: $('#titleinput').val(),
                body: $('#bodyinput').val()
            }
        }).then((data) => {
            $('#notes').empty();
        });
        $('#note-body').val('');
    });

    $(document).on('click', '.delete', function () {
        const selected = $(this);
        $.ajax({
            type: 'POST',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: `/unsave/${selected.attr('data-id')}`,
            dataType: 'json',
            data: {
                saved: false
            },
            success: (data) => {
                console.log(`Removed from saved:\n${data}`);
            }
        }).then(() => {
            $.getJSON('/saved', (data) => {
                $('#articles').empty();
                for (let i = 0; i < data.length; i++) {
                  const article = renderSaved(data[i]);
                  $('#articles').append(article);
                }
            });
        });
    });

    $(document).on('click', '.note', function () {
        $('#notes-list').empty();
        const thisId = $(this).attr('data-id');
        $('#submit-note').attr('data-id', thisId);
        $.ajax({
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: `/notes/${thisId}`
        }).then((article) => {
            $('#article-title').text(article.title);
            const { notes } = article;
            notes.forEach((note: {
            body:
            | string
            | number
            | boolean
            | ((this: HTMLElement, index: number, text: string) => string | number | boolean)
            }) => {
                const newNote = $('<li>').text(note.body);
                $('#notes-list').append(newNote);
            });
        });
    });

    $(document).on('click', '#submit-note', function () {
        const thisId = $(this).attr('data-id');
        const noteBody = $('#note-body').val();
        $.ajax({
            method: 'POST',
            headers: { 'Access-Control-Allow-Origin': '*' },
            url: `/note/${thisId}`,
            data: {
                body: noteBody
            }
        }).then((response) => {
            $('#note-body').val('');
            const newNote = $('<li>').text(response);
            $('#notes-list').append(newNote);
        });
    });
});
