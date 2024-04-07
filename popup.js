const form = document.getElementById('control-row');
const message = document.getElementById('message');


form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(event) {
  event.preventDefault();


  const cookieNames = ["__cf_bm", "ak_bmsc", "Queue-Fair", "__cfwaitingroom"]; // Add the cookie names you want to check for here

  // Map the cookie names to their respective service name
  const cookieMap = {
    "__cf_bm": "Cloudflare Bot Management",
    "ak_bmsc": "Akamai Bot Manager",
    "Queue-Fair": "Queue-Fair",
    "__cfwaitingroom": "Cloudflare Waiting Room"
  }

  await chrome.cookies.getAll({}, cookies => {
    message.hidden = false;

    for(var i=0; i<cookies.length; i++) {
      if(cookieNames.includes(cookies[i].name)) {
        message.innerHTML += `<b>${cookieMap[cookies[i].name]}</b> is present on this domain<br>`;
      }
    }
  });
}
