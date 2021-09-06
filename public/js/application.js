const allFilmsDiv = document.querySelector('.allFilmsDiv');
const errorr = document.querySelector('.errorr');

allFilmsDiv.addEventListener('click', async (event) => {
  if (event.target.closest('div').classList.contains('oneFilmDiv')) {
    window.location = `http://localhost:3000/filmTrailer/${event.target.closest('div').id}`;
  }
});

// speech

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
recognition.grammars = speechRecognitionList;
recognition.lang = 'ru-RU';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const microphoneIcon = document.querySelector('.microphone__image');
const microphoneWrapper = document.querySelector('.microphone-wrapper');
const audioRecordAnimation = document.querySelector('.audio-record-animation');

microphoneIcon.onclick = function () {
  recognition.start();
  console.log('Ready to receive a color command.');
  errorr.innerHTML = '';
};

recognition.onaudiostart = function () {
  microphoneWrapper.style.visibility = 'hidden';
  audioRecordAnimation.style.visibility = 'visible';
};

recognition.onspeechend = function () {
  recognition.stop();
  microphoneWrapper.style.visibility = 'visible';
  audioRecordAnimation.style.visibility = 'hidden';
};

recognition.onresult = function (event) {
  const voiceRequest = event.results[0][0].transcript;
  // console.log(voiceRequest);

  async function getFilm(inputValue) {
    const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${inputValue}&page=1`, {
      headers: {
        accept: 'application/json',
        'X-API-KEY': '1f1379e4-9ae8-45ad-a941-e51333196ee3',
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    allFilmsDiv.innerHTML = '';
    for (let i = 0; i < responseData.films.length; i++) {
      allFilmsDiv.innerHTML
      += `<div class="oneFilmDiv" id="${responseData.films[i].filmId}">
        <p class="oneFilmTitle">${responseData.films[i].nameRu}</p>
        <img class="img" src="${responseData.films[i].posterUrl}" alt="">
        <p class="oneFilmYear">${responseData.films[i].year}, ${responseData.films[i].countries[0].country}</p>
      </div>`;
    }
  }

  if (voiceRequest) {
    getFilm(voiceRequest);
  }
};

recognition.onerror = function () {
  recognition.stop();
  errorr.innerHTML = '<p>Я не понiв, повтори</p>';
  microphoneWrapper.style.visibility = 'visible';
  audioRecordAnimation.style.visibility = 'hidden';
};
