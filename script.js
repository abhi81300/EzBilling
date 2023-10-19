var numberToText = require('number2text');

function convert(num) {
    var textIndian = numberToText(num, 'Indian');
    if (num === 1) { // Use strict equality (===) for comparison
      console.log(`${textIndian} Rupee Only`);
      document.getElementById("result").textContent = `${textIndian} Rupee Only`;
    } else if (num === 0) { // Use strict equality (===) for comparison
      console.log(`Zero`);
      document.getElementById("result").textContent = `Zero`;
    } else {
      console.log(`${textIndian} Rupees Only`);
      document.getElementById("result").textContent = `${textIndian} Rupees Only`;
    }
}  
let serial = 1;
let productRates = {};

const productNameInput = document.getElementById("itmname");
const suggestions = document.getElementById("suggestions");

var t1;
var t2;
var t3;
var t4;

async function fetchTaxRates() {
    try {
        const response = await fetch('./tax_rates.txt');
        const data = await response.text();
        const lines = data.split('\n');
        const taxRates = {};

        lines.forEach(line => {
            const [taxName, percentage] = line.split(':');
            const trimmedTaxName = taxName.trim();
            const parsedPercentage = parseFloat(percentage);
            if (trimmedTaxName && !isNaN(parsedPercentage)) {
                taxRates[trimmedTaxName] = parsedPercentage;
            }
        });

        

        // You can now use the taxRates object to access tax percentages
        // console.log(taxRates);
        document.getElementById('vat-per').textContent = `VAT ${taxRates["VAT"]}%`
        document.getElementById('sc-per').textContent = `Service Charge ${taxRates["Service Charge"]}%`
        document.getElementById('st-per').textContent = `Surge Tax ${taxRates["Surge Tax"]}%`
        document.getElementById('ot-per').textContent = `Other Tax ${taxRates["Other Tax"]}%`

        t1 = taxRates["VAT"];
        t2 = taxRates["Service Charge"];
        t3 = taxRates["Surge Tax"];
        t4 = taxRates["Other Tax"];

        

    } catch (error) {
        console.error('Error fetching tax rates:', error);
    }
}

// Call the function to fetch tax rates when needed
fetchTaxRates();




fetch('./product_rates.txt')
.then(response => response.text())
.then(data => {
    // Parse the text data into an object
    const lines = data.split('\n');
    for (const line of lines) {
        const [productName, price] = line.split(':');
        productRates[productName.trim()] = parseFloat(price);
    }
});

function addSuggestion(product) {
    const suggestionItem = document.createElement("div");
    suggestionItem.classList.add("suggestion-item");
    suggestionItem.textContent = product;
    suggestionItem.addEventListener("click", function() {
        productNameInput.value = product;
        suggestions.style.display = "none";
    });
    suggestions.appendChild(suggestionItem);
}

productNameInput.addEventListener("input", function() {
    const inputText = productNameInput.value.toLowerCase();
    if (inputText.length === 0) {
        suggestions.style.display = "none";
    } else {
        suggestions.style.display = "block";
        suggestions.innerHTML = "";
        Object.keys(productRates).forEach(product => {
            if (product.toLowerCase().includes(inputText)) {
                addSuggestion(product);
            }
        });
    }
});

// Close the suggestions when clicking outside
document.addEventListener("click", function(event) {
    if (!suggestions.contains(event.target) && event.target !== productNameInput) {
        suggestions.style.display = "none";
    }
});

function DeleteRows() {
    var table = document.getElementById("productTable");
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        tblCustomers.deleteRow(i);
    }
}

function addRow() {
    let grand = document.getElementById('gndttl');
    let txamt = document.getElementById('txamt');
    var totalamount = document.getElementById('totalamt');
    var vatx = document.getElementById('vatx');
    let scharge = document.getElementById('sctx');
    let stcharge = document.getElementById('stx');
    let otcharge = document.getElementById('otx');
    let rd = document.getElementById('round-of');
    var productName = document.getElementById("itmname").value;
    var quantity = document.getElementById("qty").value;
    var rate = productRates[productName] || 'N/A';
    if (productName !== "" && quantity !== "") {
        var table = document.getElementById("productTable");
        var tbody = table.querySelector("#billtable");
        var newRow = tbody.insertRow();
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);

        const amt = parseInt(quantity) * rate;

        cell1.textContent = serial;
        cell2.textContent = productName;
        cell3.textContent = `${quantity}`;
        cell4.textContent = `₹ ${rate}`;
        cell5.textContent = `₹ ${amt.toFixed(2)}`;
        totalamt = totalamt+amt;
        totalamount.textContent = `₹ ${totalamt.toFixed(2)}`;
        let vatx1 = (t1/100 * totalamt);
        let scharge1 = (t2/100 * totalamt);
        let stcharge1 = (t3/100 * totalamt);
        let otcharge1 = (t4/100 * totalamt);
        // console.log(typeof vatx1);
        // console.log(typeof scharge1);
        // console.log(typeof stcharge1);
        // console.log(typeof otcharge1);
        vatx.textContent = `₹ ${vatx1.toFixed(2)}`;
        scharge.textContent = `₹ ${scharge1.toFixed(2)}`;
        stcharge.textContent = `₹ ${stcharge1.toFixed(2)}`;
        otcharge.textContent = `₹ ${otcharge1.toFixed(2)}`;
        
        let taxamt1 = (vatx1+ scharge1+ stcharge1+ otcharge1).toFixed(2)
        txamt.textContent = `₹ ${taxamt1}`;

        let grndamt = (parseInt(totalamt) + vatx1+ scharge1+ stcharge1+ otcharge1).toFixed(2);
        let round = Math.round(grndamt);
        // console.log(`before rn off ${grndamt}`);
        let grndamt1 = parseInt(grndamt).toFixed(2);
        // console.log(round);
        let fgr = (round - grndamt).toFixed(2);

        rd.textContent = `₹ ${fgr}`
        grand.textContent = `₹ ${round}`
        convert(round);

        // Clear the input fields
        document.getElementById("itmname").value = "";
        document.getElementById("qty").value = "";
        serial++;}
        else {
            alert("Please enter both Product Name and Quantity.");
        }
    
}
let totalamt = 0;

const addbtn = document.getElementById('addbutton');
addbtn.addEventListener('click', addRow)

document.getElementById('delete').addEventListener('click', DeleteRows);


//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================


//browserify==>


//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================
