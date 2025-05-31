
const API_URL = "https://api.artic.edu/api/v1";
const ARTWORK_FIELDS = ['title', 'artist_title', 'date_display', 'place_of_origin'];
const IMG_PARAMETERS = "full/843,/0/default.jpg";
let current_page = 1;


function get_artworks() {
    const url = `${API_URL}/artworks?limit=10&page=${current_page}&fields=${ARTWORK_FIELDS.join(",")},image_id`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";

    xhr.onload = function() {
        if (xhr.status === 200) {
            show_artworks(xhr.response);
        }
    }

    xhr.send();
}

function show_artworks(data) {
    const table = document.getElementById("table_body");
    table.innerHTML = "";
    BASE_IMAGE_URL = data.config.iiif_url;

    const artworks = data.data;

    for (let i = 1; i < artworks.length+1; i++) {
        const art = artworks[i-1];
        const row = table.insertRow();

        let cell0 = row.insertCell();
        cell0.innerText = (current_page -1 ) * 10 + i;

        for (let j = 0; j < ARTWORK_FIELDS.length; j++) {
            let cell = row.insertCell();
            cell.innerText = art[ARTWORK_FIELDS[j]];
        }

        let imgCell = row.insertCell();
        let btn = document.createElement("button");
        btn.innerText = "Inspect";
        btn.onclick = function() {
            load_image(art.image_id);
        }
        imgCell.appendChild(btn);
    }
}

function load_image(img_id) {
    const url = `${BASE_IMAGE_URL}/${img_id}/${IMG_PARAMETERS}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";

    xhr.onload = function() {
        if (xhr.status === 200) {
            show_image(xhr.response);
        }
    }

    xhr.send();
}

function show_image(blob) {
    const modal = document.getElementById("img_modal");
    modal.innerHTML = "";
    modal.style.display = "block";

    const span = document.createElement("span");
    span.className = "close";
    span.innerHTML = "&times;";
    span.onclick = function() {
        modal.style.display = "none";
        modal.innerHTML = "";
    }

    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);

    modal.appendChild(span);
    modal.appendChild(img);
}

function next_page() {
    current_page++;
    get_artworks();
}

function previous_page() {
    if (current_page > 1) {
        current_page--;
        get_artworks();
    }
}

function setup() {
    const prev_but = document.getElementById("previous_button");
    prev_but.addEventListener('click', () => {
        previous_page();
        if (current_page == 1) {
            prev_but.disabled = true;
        }
    })

    const next_but = document.getElementById("next_button");
    next_but.addEventListener('click', () => {
        if(prev_but.disabled == true) prev_but.disabled = false;
        next_page();
    })

    get_artworks();
}


setup();