(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var serial = 1;
let productRates = {};

var productNameInput = document.getElementById("itmname") ;
const suggestions = document.getElementById("suggestions");

var t1;
var t2;
var t3;
var t4;

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
var currentDate = `${day}-${month}-${year}`;

async function fetchTaxRates() {
    try {
        const response = await fetch('./config/tax_rates.txt');
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


// JavaScript code to fetch the template, fill it, and open it in a new tab
function printInvoice() {
    // Fetch the template HTML
    fetch('templete.html')
        .then(response => response.text())
        .then(templateHtml => {
            // Create a new DOM element for the template
            const template = document.createElement('div');
            template.innerHTML = templateHtml;
            // Get the billing site's table and the template's table
            const siteTable = document.getElementById('productTable');
            const templateTable = template.querySelector('table');
            const siteRows = siteTable.querySelectorAll('tbody tr');
                if (siteRows.length === 0) {
        return; // No items to print
    }

            // Clear any existing data in the template
            templateTable.querySelector('tbody').innerHTML = '';

            // Iterate through rows in the site's table and create corresponding rows in the template's table
            siteTable.querySelectorAll('tbody tr').forEach(siteRow => {
                const newRow = templateTable.querySelector('tbody').insertRow();
                const cellsToCopy = siteRow.querySelectorAll('td');
                
                // Copy the first 5 cells from the current row
                for (let i = 0; i < Math.min(5, cellsToCopy.length); i++) {
                    const newCell = newRow.insertCell();
                    newCell.textContent = cellsToCopy[i].textContent;
                }
            });
            

            // Replace the "amount" placeholder in the template with data from the site
            const amountPlaceholder = template.querySelector('#amtbt');
            const siteAmount = document.getElementById('totalamt'); // Site element with ID "totalamt"
            amountPlaceholder.textContent = siteAmount.textContent;
            template.querySelector('#vatv').textContent = document.getElementById('vatx').textContent;
            template.querySelector('#scv').textContent = document.getElementById('sctx').textContent;
            template.querySelector('#stv').textContent = document.getElementById('stx').textContent;
            template.querySelector('#otv').textContent = document.getElementById('otx').textContent;
            template.querySelector('#txamt').textContent = document.getElementById('txamt').textContent;
            template.querySelector('#rdoff').textContent = document.getElementById('round-of').textContent;
            template.querySelector('#ttl').textContent = document.getElementById('gndttl').textContent;
            template.querySelector('#ttlinw').textContent = document.getElementById('result').textContent;
            template.querySelector('#or-id').textContent = document.getElementById('billid').value
            template.querySelector('#name').textContent = document.getElementById('name').value
            template.querySelector('#number').textContent = document.getElementById('number').value
            template.querySelector('#vat-per').textContent = document.getElementById('vat-per').textContent;
            template.querySelector('#sc-per').textContent = document.getElementById('sc-per').textContent;
            template.querySelector('#st-per').textContent = document.getElementById('st-per').textContent;
            template.querySelector('#ot-per').textContent = document.getElementById('ot-per').textContent;
            const paymentMethodSelect = document.getElementById('cars');
            const selectedPaymentMethod = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;
            template.querySelector('#date').textContent = currentDate;
            
            // Replace the "payment method" placeholder in the template with the selected option
            const paymentMethodPlaceholder = template.querySelector('#paymentMethodPlaceholder');
            paymentMethodPlaceholder.textContent = selectedPaymentMethod;


            // Create a new tab and write the filled template into it
            const newTab = window.open();
            newTab.document.write(template.innerHTML);
            newTab.print();
            
            
        });
        
}




// function printInvoice() {
//     // Your printInvoice function and other code here

//     const maxItemsPerInvoice = 1; // Define the maximum number of items per invoice
//     const siteTable = document.getElementById('productTable');
//     const siteRows = siteTable.querySelectorAll('tbody tr');

//     if (siteRows.length === 0) {
//         return; // No items to print
//     }

//     // Convert the NodeList to an array using the spread operator
//     const siteRowsArray = [...siteRows];

//     // Calculate the number of invoices needed to print all items
//     const numberOfInvoices = Math.ceil(siteRowsArray.length / maxItemsPerInvoice);
//     var newTab = window.open();
//     // Create a function to populate and print an invoice
//     function populateAndPrintInvoice(startIndex, endIndex) {
//         // Fetch the template HTML
//         fetch('templete.html')
//             .then(response => response.text())
//             .then(templateHtml => {
                
//                 // Create a new DOM element for the template
//                 const template = document.createElement('div');
//                 template.innerHTML = templateHtml;

//                 const siteTable = document.getElementById('productTable');
//                 const templateTable = template.querySelector('table');

//                 // Clear any existing data in the template
//                 templateTable.querySelector('tbody').innerHTML = '';

//                 // Iterate through rows in the site's table and create corresponding rows in the template's table
//                 siteRowsArray.slice(startIndex, endIndex).forEach(siteRow => {
//                     const newRow = templateTable.querySelector('tbody').insertRow();
//                     siteRow.querySelectorAll('td').forEach(siteCell => {
//                         const newCell = newRow.insertCell();
//                         newCell.textContent = siteCell.textContent;
//                     });
//                 });

//                 // Fill other data in the template as needed (similar to your existing code)
//                 const amountPlaceholder = template.querySelector('#amtbt');
//                 const siteAmount = document.getElementById('totalamt'); // Site element with ID "totalamt"
//                 amountPlaceholder.textContent = siteAmount.textContent;
//                 template.querySelector('#vatv').textContent = document.getElementById('vatx').textContent;
//                 template.querySelector('#scv').textContent = document.getElementById('sctx').textContent;
//                 template.querySelector('#stv').textContent = document.getElementById('stx').textContent;
//                 template.querySelector('#otv').textContent = document.getElementById('otx').textContent;
//                 template.querySelector('#txamt').textContent = document.getElementById('txamt').textContent;
//                 template.querySelector('#rdoff').textContent = document.getElementById('round-of').textContent;
//                 template.querySelector('#ttl').textContent = document.getElementById('gndttl').textContent;
//                 template.querySelector('#ttlinw').textContent = document.getElementById('result').textContent;
//                 template.querySelector('#or-id').textContent = document.getElementById('billid').value
//                 template.querySelector('#name').textContent = document.getElementById('name').value
//                 template.querySelector('#number').textContent = document.getElementById('number').value
//                 template.querySelector('#vat-per').textContent = document.getElementById('vat-per').textContent;
//                 template.querySelector('#sc-per').textContent = document.getElementById('sc-per').textContent;
//                 template.querySelector('#st-per').textContent = document.getElementById('st-per').textContent;
//                 template.querySelector('#ot-per').textContent = document.getElementById('ot-per').textContent;
//                 const paymentMethodSelect = document.getElementById('cars');
//                 const selectedPaymentMethod = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;
//                 template.querySelector('#date').textContent = currentDate;
                
//                 // Replace the "payment method" placeholder in the template with the selected option
//                 const paymentMethodPlaceholder = template.querySelector('#paymentMethodPlaceholder');
//                 paymentMethodPlaceholder.textContent = selectedPaymentMethod;
//                 // Write the filled template into the current invoice
//                 const currentInvoice = document.createElement('div');
//                 currentInvoice.className = 'invoice';
//                 currentInvoice.appendChild(template);
//                 document.body.appendChild(currentInvoice);

//                 // Use CSS to add page breaks (define the CSS class "invoice" as shown earlier)
//                 currentInvoice.classList.add('invoice');
                
//                 // Print the invoice
//                 newTab.document.write(template.innerHTML);
//                 // newTab.print(); // Print the invoice

//                 // Remove the current invoice after printing
//                 document.body.removeChild(currentInvoice);
//             });
//     }

//     // Iterate to create and print each invoice
//     for (let i = 0; i < numberOfInvoices; i++) {
//         const startIndex = i * maxItemsPerInvoice;
//         const endIndex = Math.min((i + 1) * maxItemsPerInvoice, siteRowsArray.length);

//         // Populate and print the current invoice
//         populateAndPrintInvoice(startIndex, endIndex);
//     }
// }






fetch('./config/product_rates.txt')
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
        table.deleteRow(i);
    }
    serial = 1;

}

function recalculate(){
    var grand = document.getElementById('gndttl');
    var txamt = document.getElementById('txamt');
    var totalamount = document.getElementById('totalamt');
    var vatx = document.getElementById('vatx');
    var scharge = document.getElementById('sctx');
    var stcharge = document.getElementById('stx');
    var otcharge = document.getElementById('otx');
    var rd = document.getElementById('round-of');
    totalamount.textContent = `₹ ${totalamt.toFixed(2)}`;
    var vatx1 = (t1/100 * totalamt);
    var scharge1 = (t2/100 * totalamt);
    var stcharge1 = (t3/100 * totalamt);
    var otcharge1 = (t4/100 * totalamt);
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
    console.log("recalculate is called");
}

function addRow() {
    var grand = document.getElementById('gndttl');
    var txamt = document.getElementById('txamt');
    var totalamount = document.getElementById('totalamt');
    var vatx = document.getElementById('vatx');
    var scharge = document.getElementById('sctx');
    var stcharge = document.getElementById('stx');
    var otcharge = document.getElementById('otx');
    var rd = document.getElementById('round-of');
    var productName = document.getElementById("itmname").value;
    var quantity = document.getElementById("qty").value;
    var rate = productRates[productName] || 'N/A';
    if (productName !== "" && quantity !== "") {
        var table = document.getElementById("productTable");
        var tbody = table.querySelector("#billtable");
        var newRow = tbody.insertRow();
        // newRow.id = "lol11";

        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
        var cell6 = newRow.insertCell(5);

        var amt = parseInt(quantity) * rate;

        cell1.textContent = serial;
        cell2.textContent = productName;
        cell3.textContent = `${quantity}`;
        cell4.textContent = `₹ ${rate}`;
        cell5.textContent = `₹ ${amt.toFixed(2)}`;
        cell6.outerHTML = `<td><button id='lol11' class="fa1"><i style="font-size:24px" class="fa fa11" style="color: white;">&#xf00d;</i></td>`;
        totalamt = totalamt+amt;
        totalamount.textContent = `₹ ${totalamt.toFixed(2)}`;
        var vatx1 = (t1/100 * totalamt);
        var scharge1 = (t2/100 * totalamt);
        var stcharge1 = (t3/100 * totalamt);
        var otcharge1 = (t4/100 * totalamt);
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
// function rowindex(){
//     document.addEventListener("click", function(e){
//         const targetRow = e.target.closest("tbody tr");
//          // Or any other selector.
      
//         if(targetRow){
//             myFunction(targetRow); // Pass the table row to myFunction
//           }
//       });
// }



document.addEventListener("click", function(e) {
    const removebtn = e.target.closest("#lol11");
    const targetRow = e.target.closest("tbody tr");
    const targetRow1 = e.target.closest("tbody");

    if (removebtn) {
        if (targetRow) {
            const firstCell = targetRow.querySelector("td:nth-child(1)");
            const amtCell = targetRow.querySelector("td:nth-child(5)").textContent;
            const priceWithoutCurrency = amtCell.split(" ")[1];
            const priceAsFloat = parseFloat(priceWithoutCurrency);
            totalamt = totalamt - priceAsFloat;
            if (firstCell) {
                // Access the content or perform actions with the first <td>.
                console.log("Content of first <td>: " + firstCell.textContent);
                console.log("Content of first <td>: " + amtCell);

                // Initialize a variable to keep track of the index
                let currentIndex = targetRow.rowIndex;

                for (let i = targetRow.rowIndex; i < targetRow1.rows.length; i++) {
                    // Update the first <td> in each row with a unique number
                    targetRow1.rows[i].cells[0].innerHTML = `${currentIndex}`;
                    currentIndex++;
                    serial = currentIndex;

                    }
                }
            }
            myFunction(targetRow);
            recalculate()
            if(targetRow1.children.length === 0){
                serial = 1;
        }
    }
});

document.addEventListener("click", function(e) {
    // Check if the clicked element or its ancestors have the ID "myBtn"
    const openedit = e.target.closest('#myBtn');
  
    if (openedit) {
      var modal = document.getElementById("myModal");
      var span = document.getElementById("closebtn");
  
      // When the user clicks the button, open the modal 
      modal.style.display = "block";
  
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
      }
  
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      }
      let targetRow = e.target.closest("tbody tr");
      let proname = targetRow.querySelector("td:nth-child(2)").textContent;
      let qtyedit = targetRow.querySelector("td:nth-child(3)").textContent;
      document.getElementById("itmnameedit").value = `${proname}`;
      document.getElementById("qtyedit").value = `${qtyedit}`;
      document.getElementById("mysavebtn").addEventListener('click',function(){
        targetRow.querySelector("td:nth-child(3)").textContent = document.getElementById("qtyedit").value;
        modal.style.display = "none";
        console.log("called")
      });

      console.log(`${proname} , ${qtyedit}`);
    }
  });
function myFunction(x) {
    console.log("Row index is: " + x.rowIndex);  
    document.getElementById("productTable").deleteRow(x.rowIndex);
  }





let totalamt = 0;

const addbtn = document.getElementById('addbutton');
addbtn.addEventListener('click', addRow)
var print_flag = false;
document.getElementById('delete').addEventListener('click', function(){
    if(print_flag === false){
        alert("Bill Not Printed")
    }
    else{
        location.reload();
    }

});
document.getElementById('printbtn').addEventListener('click', function(){
    print_flag = true;
    printInvoice();
    console.log(document.getElementById("stylesheets").outerHTML);
});





//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================


//browserify==>


//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================
//==============================================================================================================================================================================

},{"number2text":2}],2:[function(require,module,exports){
/**
 * Converts Number to Text.
 *
 * @param  {Number} num
 * @param  {String} type
 * @param  {Boolean} isCurrency
 * @return {String}
 */

var numberToText = require('./lib/numberToText');

module.exports = function (num,type,isCurrency) {
  return numberToText(num,type,isCurrency);
};
},{"./lib/numberToText":3}],3:[function(require,module,exports){
/**
* Note: This file require refactoring
*/

function numberToText(num, language,isCurrency)
{
  var lang = new Array("indian", "english"); //make in lower case
  var stringValue = "This is a String";
  

  if(isNaN(num))
     return "Invalid number.";
  
  if(num < 0)
    return "Please enter +ve number only.";
    
  if(isBlank(language) || isNull(language))
    language = "indian";

   if (typeof language != typeof stringValue)
    return "Please enter valid type.";
    
      
  if(lang.indexOf(language.toLowerCase()) == -1)
        return "Support for type: " + language + " is not available. Available types are: " + lang.toString();
       
  return toText(num,language,isCurrency); //currently supports for Indian number conversions    
}


function isNull(varIsNull){  return (typeof varIsNull === 'undefined'); }

function isBlank(str) {    return (!str || /^\s*$/.test(str));}

function toText(num,type,isCurrency){  
    
    var res;
    var fract_part = Math.round(frac_one(num)*100);
    var fract_num  = "";

    switch (type.toLowerCase()) {
        
        case "indian":           
            if(fract_part > 0) 
            {            
                if(isCurrency)
                    fract_num =  "And "+ toIndianText(fract_part,isCurrency) + " Paise" ;
                else
                    fract_num =  " Point "+ toIndianText(fract_part,isCurrency);
            }

            if(isCurrency)
                res = toIndianText(num,isCurrency) + " Rupee " + fract_num+" only";
            else
                res = toIndianText(num,isCurrency) + fract_num;
            break;
        case "english":
            if(fract_part > 0) 
            {            
                if(isCurrency)
                    fract_num =  "And "+ toEnglishText(fract_part,isCurrency) + " Cent" ;
                else
                    fract_num =  " Point "+ toEnglishText(fract_part,isCurrency);
            }

            if(isCurrency)
                res = toEnglishText(num,isCurrency) + " Dollar " + fract_num+" only";
            else
                res = toEnglishText(num,isCurrency) + fract_num;

            break;
    }
    return res;
}

function frac_one(num) {return num % 1;}

function toEnglishText(num,isCurrency)
{
    //For English conversion

    var quintillion = Math.floor(num / 1000000000000000000); /* quintillion */
    num -= quintillion * 1000000000000000000;
    var quar = Math.floor(num / 1000000000000000); /* quadrillion */
    num -= quar * 1000000000000000;
    var trin = Math.floor(num / 1000000000000); /* trillion */
    num -= trin * 1000000000000;
    var Gn = Math.floor(num / 1000000000); /* billion */
    num -= Gn * 1000000000;
    var million = Math.floor(num / 1000000); /* million */
    num -= million * 1000000;
    var Hn = Math.floor(num / 1000); /* thousand */
    num -= Hn * 1000;
    var Dn = Math.floor(num / 100); /* Tens (deca) */
    num = num % 100; /* Ones */
    var tn = Math.floor(num / 10);
    var one = Math.floor(num % 10);
    var res = "";

    if (quintillion > 0) {
        res += (toEnglishText(quintillion) + " Quintillion");
    }
    if (quar > 0) {
        res += (toEnglishText(quar) + " Quadrillion");
    }
    if (trin > 0) {
        res += (toEnglishText(trin) + " Trillion");
    }
    if (Gn > 0) {
        res += (toEnglishText(Gn) + " Billion");
    }
    if (million > 0) {
        res += (((res == "") ? "" : " ") + toEnglishText(million) + " Million");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") + toEnglishText(Hn) + " Thousand");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") + toEnglishText(Dn) + " Hundred");
    }


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eightteen", "Nineteen");
    var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety");

    if (tn > 0 || one > 0) {
        if(isCurrency)
        {
            if (!(res == "")) {
            res += " And "; //for currency only
            }
        }

        if (!(res == "")) {
            res += " ";
        }


        if (tn < 2) {
            res += ones[tn * 10 + one];
        } else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "Zero";
    }
    return res;
}

//This function is used for Indian conversion only
function toIndianText(num,isCurrency){
    var Gn = Math.floor(num / 10000000);  /* Crore */ 
    num -= Gn * 10000000; 
    var kn = Math.floor(num / 100000);     /* lakhs */ 
    num -= kn * 100000; 
    var Hn = Math.floor(num / 1000);      /* thousand */ 
    num -= Hn * 1000; 
    var Dn = Math.floor(num / 100);       /* Tens (deca) */ 
    num = num % 100;               /* Ones */ 
    var tn= Math.floor(num / 10); 
    var one=Math.floor(num % 10); 

    var res = ""; 

    if (Gn>0) 
    { 
        res += (toIndianText(Gn) + " Crore"); 
    } 
    if (kn>0) 
    { 
            res += (((res=="") ? "" : " ") + 
            toIndianText(kn) + " Lakh"); 
    } 
    if (Hn>0) 
    { 
        res += (((res=="") ? "" : " ") +
            toIndianText(Hn) + " Thousand"); 
    } 

    if (Dn) 
    { 
        res += (((res=="") ? "" : " ") + 
            toIndianText(Dn) + " Hundred"); 
    } 


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six","Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen","Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen","Nineteen"); 
    var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty","Seventy", "Eighty", "Ninety");

    if (tn>0 || one>0) 
    { 
          if(isCurrency)
          {
              if (!(res=="")) 
                res += " And ";
          }

        if (!(res=="")) 
                res += " ";

        if (tn < 2) 
        { 
            res += ones[tn * 10 + one]; 
        } 
        else 
        { 

            res += tens[tn];
            if (one>0) 
            { 
                res += ("-" + ones[one]); 
            } 
        } 
    }

    if (res=="")
    { 
        res = "Zero"; 
    } 
    return res;

}


//export
module.exports = numberToText;

},{}]},{},[1]);
