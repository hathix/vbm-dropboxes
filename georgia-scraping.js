// Georgia scraping
// Run this in the console at
// https://gaballotdropbox.org/
var data = [];

// $ is weird here; it's a React-y think, not jQuery
// I'm going to make a querySelector version that's more consistent
var $$ = x => document.querySelectorAll(x);

// This lets us wait X milliseconds synchronously
// From https://stackoverflow.com/a/47480429
var wait = ms => new Promise(res => setTimeout(res, ms));

async function go(){
  // Loop through all counties
  // there are 160 counties in GA, so 0 => 160
  for (let i = 0; i < 160; i++) {
    // Click the dropdown
    $('.MuiAutocomplete-popupIndicator').click();

    // Wait for it to propagate
    await wait(500);

    // Click a dropdown item
    $(`#countySelector-option-${i}`).click();

    // Wait for it to propagate
    await wait(500);

    // Now grab the list of all dropboxes here
    let county = $('#countySelector').value;
    console.log(county);

    // get NodeList of Divs containing dropbox data
    let dropboxDivs = $$(".jss6 div.MuiBox-root div.MuiBox-root");
    dropboxDivs.forEach((div) => {
        // Sometimes a location name is given, in which case it's child 0
        // and the address is child 1
        // Other times it's not, in which case address is child 0
        // After that, there are 2 optional items: hours and misc notes

        // Address is always an <a>. If an A is #0, then no location name.
        if (div.children[0].tagName.toLowerCase() === "a") {
          // 0 is the address
          // 1 is hours (optional)
          // 2 is misc notes (optional)
          data.push({
            county: county,
            location: null,
            address: arrayGet(div.children, 0, "innerHTML"),
            hours: arrayGet(div.children, 1, "innerHTML"),
            notes: arrayGet(div.children, 2, "innerHTML"),
          });
        }
        else {
          // child 0 is the name of the location (ABC Building)
          // 1 is the address
          // 2 is hours (optional)
          // 3 is misc notes (optional)
          // FIXME: sometimes the location isn't given so address is #0
          // (check this by seeing if child 0 is an <a>, since address is)
          data.push({
            county: county,
            location: arrayGet(div.children, 0, "innerHTML"),
            address: arrayGet(div.children, 1, "innerHTML"),
            hours: arrayGet(div.children, 2, "innerHTML"),
            notes: arrayGet(div.children, 3, "innerHTML"),
          });
        }
    });
    console.log(data.length);

    // Wait before starting again
    await wait(500);
  }
}
go();

// Safe getter of elements' values from an array
function arrayGet(array, index, attr) {
  if (array[index]) {
    return array[index][attr];
  }
  else {
    return null;
  }
}
