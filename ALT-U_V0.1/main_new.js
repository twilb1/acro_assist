let fileHandle;
let dirHandle;
let nodes_data = [];
let loc = window.location.pathname;
let text;
let currentFileHandle;
// console.log(loc);

let save_btn = document.getElementById("save_btn");
let save_as_btn = document.getElementById("save_as_btn");
// let but_files = document.getElementById("butFiles");
let doc_title = document.getElementById("docTitle");
// let open_file = document.getElementById("open_file");
let toggle_editible = document.getElementById("toggle_editible");
save_btn.disabled = true;
save_as_btn.disabled = true;
// but_files.disabled = true;
// open_file.disabled = true;
toggle_editible.disabled = true;
let left = document.getElementById("left")
let right = document.getElementById("right")
let inside_right = document.getElementById("inside_right")
let header = document.getElementById("header")
let toolbar = document.getElementById("toolbar")
let docTitle = document.getElementById("docTitle")
let subtitle = document.getElementById("subtitle")
let title = document.getElementById("title")
let links_data = [];
let stylesheet = document.getElementById("stylesheet")

document.addEventListener ("keydown", function (zEvent) {    // listen for key combination Alt + 'u' or Alt + 'U'
    if (zEvent.altKey && (zEvent.key === "u" || zEvent.key === "U")) {  
      console.log("Ctrl, Alt, and a pressed.");
      if(toolbar.style.display == "block")
      {
          toolbar.style.display = "none" 
      }
      else
      {
          toolbar.style.display = "block"
          if(currentFileHandle == null){
            console.log("No file selected.")
          }
      }
  }
} );

let title_text;

subtitle.addEventListener('change', function (evt) {         // populate the title
//  console.log(this.value);
  subtitle.value = this.value;
  title.innerText = this.value;
//  console.log("Kilroy was here!")
  saveTitle();
});

/* async function getTitleFromFile(fileHandle){
  const titleData = await fileHandle.getFile().then()
  {
    text = await titleData.text().then()
    {
      if(text !== null){
        title_text = text;
      }
      else{
        title_text = "Undefined - No Title Defined"
      }
    }
  };
  return title_text;
} */



/*
// get number of selected files
const inputElement = document.getElementById("inputElement")
// let numFiles = inputElement.files.length;
// console.log(numFiles);
inputElement.onchange = (e) => {
    const files = Array.from(e.target.files) // FileList to Array
    // get number of selected files
    numFiles = files.length
    console.log(files.length)
    files.forEach((file) => {
        const reader = new FileReader()
        // readyState is 0, result is null
        reader.onload = () => {
        // readyState is 2, result is the file's content
            // console.log(reader.result)
            var str = reader.result;
            let docTitle;
            var firstLine = str.split('\n').shift()
            firstLine = firstLine.replace("# ", "")
            nodes_data.push({name: file.name, label: firstLine});
//            console.log(firstLine)

            var regex = /\/.*md/g;
            let result;
            while((result = regex.exec(str)) !== null) {
                let link_tgt = result[0].replace("/","")
                links_data.push({"source": file.name, "target": link_tgt});            
            }
            console.log(links_data);
        }
        reader.onerror = () => {
        // readyState is 2, result is null
        }
        // readyState is 0, result is null
        reader.readAsText(file)
        // readyState is 1, result is null
    })
} */

/*
async function openFileViaPicker(){
    [fileHandle] = await window.showOpenFilePicker({
        types: [
            {
                description: 'Markdown Only',
                accept: {
                    'test/*': ['.md']
                }
            },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
        startIn: dirHandle
    });
    console.log(fileHandle.kind);
    await openFile(fileHandle);
  } */

// Get file data an display in middle area
async function openFile(fileHandle){
    let fileData = await fileHandle.getFile();
    currentFileHandle = fileHandle;
    // console.log(fileData);
    text = await fileData.text();
    // console.log(text);
    middle.innerText = text;
    genToc(text);

    middle.innerHTML = marked.parse(text);
    // rendered.innerHTML = marked.parse(text);
    middle.addEventListener("input", (e) => {
//        console.log(e);
        text = middle.innerText;
//        save();
        genToc(text);
      }, false); 
    currentFileHandle = fileHandle;
}

function genToc(mdText){                                   // mdText is the file content
    inside_right.innerHTML = "<p style=\"color: white\"><b>On This Page</b></p>";
    let regex = /^#+\s.*/gm;
    let result, hLinkID, hLinkTxt;
    while((result = regex.exec(mdText)) !== null) 
    {
        hLevel = (result[0].match(/#/g) || []).length;     // The heading level
        // console.log("Result[0] is: " + result[0]);
        let regex2 = /^(#*\s)/gm;                          // Regex to extract the # part
        let hashPart = regex2.exec(result[0]);             // The # part
        // console.log("Hash part: " + hashPart[0]); 
        let headOnly = result[0].replace(hashPart[0],"");  // Remove the # part to get the heading title
        // console.log(hLinkID);
        hLinkID = headOnly.replace(/\s+/g, '-').toLowerCase();  // Create the corresponding link
        let indent = "<p class=\"ptoc\">";
        if(hLevel > 1){
            indent += "&nbsp;&nbsp;".repeat(hLevel)              // Depending on the level add spaces
        }
        hLinkID = "#" + hLinkID;                                // Add # infront of the link ID
        // console.log("Link ID: " + hLinkID);
        inside_right.innerHTML += indent + `<a id=\"toc\" class=\"toc\" href=\"${hLinkID}\">${headOnly}</a></p>`      
    }
}

function convertHeadingToLocalLink(heading){
  let regex = /^(#*\s)/gm;
  let result = regex.exec(heading)
  // console.log("Result is: " + result[0])   // This is just the hash part of the heading
  let test1 = heading.replace(result[0],"") // Remove the # component
  // console.log("Test1 is: " + test1)
  let test2 = test1.replace(/\s+/g, '-').toLowerCase();
//  let test2 = test1.toLowerCase().replace(" ","-")  // Convert to lowercase and replace space with "-"
  // console.log("Test2 is: " + test2)
  let test = "[" + test1 + "]" + "(#" + test2 + ")"
  // console.log("Test is: " + test)
  return "#" + test2
}

async function save(){
    // let temp = currentFileHandle; 
    let stream = await currentFileHandle.createWritable();
    await stream.write(middle.innerText);
    await stream.close();
//    showFileList(dirHandle);
    // currentFileHandle = temp;
}

async function saveTitle(){
  let stream = await titleHandle.createWritable();
  await stream.write(subtitle.value);
  await stream.close();
  document.title = subtitle.value;
}

async function saveAs(){
    new_handle = await window.showSaveFilePicker();
    save(new_handle);
    currentFileHandle = new_handle;
}

// Handle selection of project directory
let titleHandle;
const chooseDir = document.getElementById('chooseDir');
chooseDir.addEventListener('click', async () => {
  dirHandle = await window.showDirectoryPicker();
  console.log(dirHandle);
  await showFileList(dirHandle);      // This should populate titleHandle.

  // console.log("Do we get here?");
  // console.log(titleHandle);

  // but_files.disabled = false;

  let theTitle = await getTitleFromFile(titleHandle);
//  console.log(theTitle);
//   docTitle.innerText = theTitle;
//          subtitle.setAttribute("readOnly", false)
          subtitle.readOnly = false;

  subtitle.value = theTitle;
//  title.textContent = theTitle;



//  for await (const entry of dirHandle.values()) {
    // console.log(entry.kind, entry.name);
//    if(entry.name.includes(".md")) {
//        console.log(entry.name);
//        nodes_data.push({name: entry.name});
//    }
//  }
});

let mdFileHandles = [];
let cssFileHandles = [];
let firstPass = true;
// Show files list
async function showFileList(dirHandlePtr){
  // let temp = currentFileHandle;
  cssFileHandles = [];
  // console.log(dirHandlePtr)
  // console.log("Files List: ")
  let head;
  let fileHandle;
  let text;
  left.innerHTML = "<p style=\"color: white\"><b>Site Map</b></p>";
  for await (const entry of dirHandlePtr.values()) {
    // console.log(entry.kind, entry.name);
    if(entry.name.includes("Title")){                // Get the file handle of the Title file
      titleHandle = entry;
    }
    else if(entry.name.includes(".css") && firstPass){                // Get the file handle of the Title file
      cssFileHandles.push({name: entry.name});
      // console.log("CSS Name is:" + entry.name);
    }
    else if(entry.name.includes(".md")) {
        temp = entry;      
        // console.log(entry.name);
        // console.log(entry.kind);
        head = await getHead1fromFile(entry);
        let id = entry.name.replace(".md","")
//        entries.push(id);
        mdFileHandles.push({id: id, handle: entry})
        left.innerHTML += '<p class="ptoc" id="' + id + '">' + head + '</p>';
    }
  }
//  console.log("CSS Files Length:" + cssFileHandles.length)
//  console.log(cssFileHandles[1]);
//  console.log(mdFileHandles.length);
//  console.log(mdFileHandles[3]);
  mdFileHandles.forEach(function(item) {
      console.log("md file id: " + item.id);
      document.getElementById(item.id).addEventListener('click', function(){
      console.log('md file handle: ' + item.handle);
      openFile(item.handle);
      // currentFileHandle = item.handle;
      toggle_editible.disabled = false;
    });
  })

  cssFileHandles.forEach(function(item) {
    let select = document.getElementById("stylenames");
      var opt = item.name;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      select.appendChild(el);

      function onChange() {
        var value = select.value;
        var text = select.options[select.selectedIndex].text;
//        console.log(value, text);
        stylesheet.setAttribute("href", value)
      }
      select.onchange = onChange;
      onChange();


//    console.log(item.id);
//    document.getElementById(item.id).addEventListener('click', function(){
//      console.log('We got here!');
//      openFile(item.handle);
//      currentFileHandle = item.handle;
//      toggle_editible.disabled = false;
//    });
  })
  firstPass = false;
  // currentFileHandle = temp;
}

async function getTitleFromFile(fileHandle){
  const fileData = await fileHandle.getFile().then()
//  let heading;
  {
    text = await fileData.text().then()
    {
      if(text !== null){
        title = text;
//        console.log(title);
        document.title = title;     // Set the title of the page
      }
      else{
        title = "Undefined - No Heading 1"
        document.title = title;     // Set the title of the page
      }
    }
  };
  return title;
}

async function getHead1fromFile(fileHandle){
  const fileData = await fileHandle.getFile().then()
  let heading;
  {
    text = await fileData.text().then()
    {
      let regex = /^#\s.*/gm;
      if((result = regex.exec(text)) !== null){
        heading = result[0];
        heading = heading.replace("# ","")
//        console.log(heading);
      }
      else{
        heading = "Undefined - No Heading 1"
      }
    }
  };
  return heading;
}

/* const butFiles = document.getElementById('butFiles');
butFiles.addEventListener('click', async () => {
  console.log(dirHandle);
  showFileList(dirHandle);
}) */

let editable = false
function toggleEditable(){
//    console.log("Current file handle is: " + currentFileHandle.id)
    var myDiv = document.getElementById("middle")
    editable = myDiv.getAttribute("contenteditable")
    var isTrueSet = (editable === 'true');               // true if contenteditable is set
    var myButton = document.getElementById("toggle_editible")
    if(isTrueSet){
        myButton.innerHTML = "Edit"
        myDiv.style.backgroundColor = "white"

/*        marked.setOptions({
          renderer: new marked.Renderer(),
          highlight: function(code, lang) {
            const hljs = require('highlight.js');
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          },
          langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
          pedantic: false,
          gfm: true,
          breaks: false,
          sanitize: false,
          smartypants: false,
          xhtml: false
        });  */

        middle.innerHTML = marked.parse(text);
        save_btn.disabled = true;
        save_as_btn.disabled = true;
        myDiv.style.fontFamily = "sans-serif";
//        middle.style.height = `${middle.scrollHeight}px`;

//                myDiv.style.overflowY = "hidden"
    }
    else{
        myButton.innerHTML = "Preview"
        myDiv.style.backgroundColor = "#1E1E1E"
//        middle.innerText = text;
        middle.innerHTML = '<pre class="markdown"><code>' + text + '</code></pre>';
        hljs.highlightAll();
        save_btn.disabled = false;
        save_as_btn.disabled = false;
//        myDiv.style.fontFamily = "monospace";

//                myDiv.style.overflowY = "scroll"
    }
    isTrueSet = !isTrueSet                                // if true, set it to false  
    myDiv.setAttribute("contenteditable", isTrueSet)      // set the attribute accordingly
}


async function viewG(){
    // first clear the old graph if it exists
    d3.selectAll("svg > *").remove();

    // create somewhere to put the force directed graph
    var svg = d3
        .select("svg")
        .attr("width", 960)
        .attr("height", 600);
  
  var linkSelection = svg
    .selectAll("line")
    .data(links_data)
    .enter()
    .append("line")
    .attr("stroke", "black")
    .attr("stroke-width", 1);
  
  var nodeSelection = svg
    .selectAll("circle")
    .data(nodes_data)
    .enter()
    .append("circle")
//    .attr("r", d => d.size)
    .attr("r", 12)
//    .attr("fill", d => d.color)
    .attr("fill", "blue")
    .call(
        d3
            .drag()
            .on("start", dragStart)
            .on("drag", drag)
            .on("end", dragEnd)
        );
  
    var label = svg.append("g").attr("class", "labels")
        .selectAll("text")
        .data(nodes_data)
        .enter().append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.label });                          

  var simulation = d3.forceSimulation(nodes_data);
  
  simulation
    .force("center", d3.forceCenter(900 / 2, 600 / 2))
    .force("nodes", d3.forceManyBody())
    .force(
      "links",
      d3
        .forceLink(links_data)
//        .id(d => d.color)
        .id(d => d.name)
//        .distance(d => 5 * (d.source.size + d.target.size))
        .distance(d => 5 * 30)
    )
    .on("tick", ticked);
  
  function ticked() {
    // console.log(simulation.alpha());
  
    nodeSelection.attr("cx", d => d.x).attr("cy", d => d.y);
  
    linkSelection
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    label
      .attr("x", function(d){ return d.x; })
      .attr("y", function (d) {return d.y - 10; });

  }
  
  function dragStart(d) {
    // console.log('drag start');
    simulation.alphaTarget(0.5).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function drag(d) {
    // console.log('dragging');
    // simulation.alpha(0.5).restart()
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragEnd(d) {
    // console.log('drag end');
    simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

function getFileHandle(param1){           // param1 is the name of the file, e.g. doc1.md
  mdFileHandles.forEach((item) => {
    console.log("In getFileHandle, fileToOpen: " + param1);
    param1 = param1.replace(".md","");
    if(item.id == param1){
      console.log("The handle is: " + item);
      return item;
    }
  });
}

let fileToOpen;
let slinkFileName;
let slinkID;
document.addEventListener(`click`, async e => {
  let top;
  const origin = e.target.closest(`a`);
  if (origin) {
    let linkFull, linkFileName, linkID, slinkID
    const href = origin.href;
    console.log(href);

    let regex = /\/(?:.(?!\/))+$/gm;   // Everything after the final '/' character
    if(href.includes(".md")){            // Link is a link to another file 
      e.preventDefault();
      if((linkFull = regex.exec(href)) !== null){
        console.log("Full Link is: " + linkFull);
      }

      regex = /\/.*#/gm  // Get the file name
    if((linkFileName = regex.exec(linkFull)) !== null){
//        slinkFileName = String(linkFileName);
        slinkFileName = linkFileName[0];
        slinkFileName = slinkFileName.replace("/","")
        slinkFileName = slinkFileName.replace("#","")

        console.log("File Name of Link is: " + slinkFileName);
//        fileToOpen = getFileHandle(slinkFileName);
//        console.log("Handle of file to open is: " + fileToOpen);
//        index = mdFileHandles.findIndex(fileHandle => fileHandle.id == "doc4.md");  // Get index of file with filename
//        console.log("Index is: " + index);

        a = [
          {prop1:"abc",prop2:"qwe"},
          {prop1:"bnmb",prop2:"yutu"},
          {prop1:"zxvz",prop2:"qwrq"}];
        index = a.findIndex(x => x.prop2 ==="qwrq");
        console.log("Index from example is: " + index);
        console.log(mdFileHandles);
        // One entry = { id: 'doc4.md', handle: FileSystemFileHandle }
        slinkFileName = slinkFileName.replace(".md","");
        index = mdFileHandles.findIndex(x => x.id == slinkFileName);
        console.log("The index for " + slinkFileName + " is: " + index);
    
    }
    regex = /#.*/gm  // Get the file link
    if((linkID = regex.exec(linkFull)) !== null){
        slinkID = String(linkID).replace("#","");
        console.log("File Link is: " + slinkID);
    }


//      await openFile(mdFileHandles[3].handle);   // THIS IS HARDCODED CURRENTLY  // ALSO NEED TO SET currentFileHandle here
      await openFile(mdFileHandles[index].handle);   // THIS IS HARDCODED CURRENTLY  // ALSO NEED TO SET currentFileHandle here
      currentFileHandle = mdFileHandles[index].handle;
      console.log("File Link is: " + slinkID);
//      top = document.getElementById(slinkID).offsetTop; //Getting Y of target element
//      window.scrollTo(0, top);                        //Go there directly or some transition
    }
    else{             // Link within current file; just go to top of page
//      top = document.getElementById(slinkID).offsetTop; //Getting Y of target element
//      window.scrollTo(0, top);                        //Go there directly or some transition
    }
  }
});



