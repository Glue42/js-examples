// Client database.
import { clients } from "./clients-db.js";

// The name of the Intent for which to listen.
const intent = "DisplayPortfolio";

let clientNameElement;
let portfolioContainer;
// Holds the context of the current window.
let context;

/** SET UP THE APPLICATION **/
window.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
    clientNameElement = document.getElementById("client-name");
    portfolioContainer = document.getElementById("portfolio-table");

    // Initialize the Glue42 library.
    await initializeGlue42().catch(console.error);

    // Get the context of this window.
    context = glue.windows.my().context;
    const clientID = context.data?.clientID;

    displayPortfolio(clientID);
    
    // Add an Intent listener to handle an intent request targeted at this application.
    glue.intents.addIntentListener(intent, updateContext);
};

/** INITIALIZE GLUE42 **/
async function initializeGlue42() {
    window.glue = await Glue();
};

// Handler for the Intent listener. Receives the new context from the raised Intent.
function updateContext(newContext) {
    const clientID = newContext.data.clientID;
    
    displayPortfolio(clientID);
};

/** DOM ELEMENT MANIPULATIONS **/
function displayPortfolio(clientID) {
    if (!clientID) {
        return;
    };

    const client = clients.find(client => client.id === clientID);
    const clientName = client.name;
    const clientPortfolio = client.portfolio;
    const instrumentRows = clientPortfolio.map(createInstrumentRows);

    portfolioContainer.innerText = "";
    clientNameElement.innerText = clientName;
    portfolioContainer.append(...instrumentRows);
};

function createInstrumentRows(asset) {
    const instrument = asset.instrument;
    const shares = asset.shares;
    const price = asset.price;
    const instrumentRow = document.createElement("tr");
    const nameColumn = document.createElement("td");
    const sharesColumn = nameColumn.cloneNode();
    const priceColumn = nameColumn.cloneNode();

    nameColumn.innerText = instrument;
    sharesColumn.innerText = shares;
    priceColumn.innerText = price;
    instrumentRow.append(nameColumn, sharesColumn, priceColumn);

    return instrumentRow;
};