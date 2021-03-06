const calendarWidth = 600;
const itemColor = '#606EA2'; 
const eventBgColor = '#FFFFFF';
const locColor = '#B1B3B2';
var eventColumns = [];
var allEvents = [];
Number.prototype.isBetween = function(a, b){return (this >= a && this <= b);}

function clearCalendar()
{
    document.querySelector(".cal-container").innerHTML = "";
}

//main method
function layOutDay(eventDicts) 
{   
    clearCalendar();
    console.log(allEvents);
    //clear the board everytime new events are to be laid out then preform
    //functions using list of all events both old and new
    for (let i = 0; i < eventDicts.length; i++)
    {
        allEvents.push(eventDicts[i]);
    }
    addOverlaps(allEvents);
    mostOverlaps = findMostOverlaps(allEvents);
    //make a 2d array of empty arrays with the length of the event with the most overlaps 
    eventColumns = new Array(mostOverlaps);
    for (var i = 0; i < eventColumns.length; i++) {
        eventColumns[i] = new Array();
    }
    //create events given dictionaries describing events with their starting times, 
    //ending times and # of times they overlap with other events
    for (let i = 0; i < allEvents.length; i++)
    {
        createEvent(allEvents[i], eventColumns);
    }
}

function setMargin(eventDict, event, numOverlaps, eventColumns)
{
    if (numOverlaps > 1) // anything that only overlaps with itself will be set to a margin of 0 by default
    {
        for (let i = 0; i < eventColumns.length; i++)
        {
            // To have an event placed in a certain column, the column must either be empty
            // or the event cannot overlap with any of the elements in the column. The loop
            // will go through all columns until it finds one that satisfies those conditions.
            // Each event has to fit into at least one column because the number of
            // columns was initialized equal to the maximum number of overlaps.
            if (eventColumns[i] == [] || isOverlapping(eventDict, eventColumns[i]) == false)
            {
                event.style.marginLeft = calendarWidth * i / numOverlaps + 'px';
                eventColumns[i].push(eventDict); // add the event to 
                break;
            }
        }
    }
}

function createEvent (eventDict, eventColumns)
{
    start = eventDict.start
    width = calendarWidth/eventDict.overlaps;
    container = document.querySelector('.cal-container');
    container.style.zIndex = '-1';
    event = document.createElement('div');
    event.classList.add('Eventat' + start);
    setEventStyle(event, eventDict, width + 'px', eventDict.overlap);
    createItem(event, start);
    createLocation(event);
    setMargin(eventDict, event, eventDict.overlaps, eventColumns)
    container.appendChild(event);
}

/* ---------------------------------handling overlapping events--------------------------------- */

function isOverlapping(eventDict, eventsInColumn)
{
    var currentEventStart = eventDict.start
    var currentEventEnd = eventDict.end
    for (let i = 0; i < eventsInColumn.length; i++)
    {
        var priorEventStart = eventsInColumn[i].start
        var priorEventEnd = eventsInColumn[i].end;
        if (currentEventStart.isBetween(priorEventStart, priorEventEnd) 
        || currentEventEnd.isBetween(priorEventStart, priorEventEnd))
        {
            return true
        }
    }
    return false
}

function findMostOverlaps(events)
{
    mostOverlaps = 0;
    
    for (let i = 0; i < events.length; i++)
    {
        if (events[i].overlaps > mostOverlaps)
        {
            mostOverlaps = events[i].overlaps;
        }

    }
    return mostOverlaps;
}

// add the overlaps kv pair to every event
function addOverlaps(events) 
{
    for (let i = 0; i < events.length; i++)
    {
        checkOverlaps(events, events[i]); 
    }
}

// checks how many times an event overlaps with other events 
// (including itself) and adds that as a kv pair to the dict describing the event 
function checkOverlaps(events, eventDict) 
{   
    //problem with this fxn is that if theres something that has more overlapping starts 
    //then it'll set the numoverlaps to that event even if only the end of that event overlaps with another event
    start = eventDict.start
    end = eventDict.end
    numOverlappingStarts = 0;
    numOverlappingEnds = 0;
    for (let i = 0; i < events.length; i++)
    {
        event = events[i]
        eventStart = events[i].start;
        eventEnd = events[i].end;
        if ((start.isBetween(eventStart, eventEnd)))
        {
            numOverlappingStarts++;
        }
        if (end.isBetween(eventStart, eventEnd))
        {
            numOverlappingEnds++;
        }
    }
    
    // add the number of times the event overlaps to the dict describing its start and end
    numOverlaps = Math.max(numOverlappingStarts, numOverlappingEnds);
    eventDict['overlaps'] = numOverlaps
}

/* ---------------------------------styling functions--------------------------------- */
function setEventStyle (event, eventDict, width)
{
    var start = eventDict.start
    var end = eventDict.end
    event.style.position = 'absolute';
    event.style.top = start+'px';//sets y position
    event.style.width = width;//second term accounts for left border
    event.style.height = Math.abs(end - start) + 'px';
    event.style.backgroundColor = eventBgColor; 
    event.style.zIndex = 1;
    event.style.borderLeft = `${calendarWidth / 100}px solid ${itemColor}`;
}

function createItem(event, start) //creates calendar event name and appends to event div
{
    item = document.createElement('h2');
    item.textContent += 'Sample Item';
    item.style.fontWeight = '650';
    setTextStyle(item, '16px', itemColor, start);
    event.appendChild(item);
}

function createLocation(event) //creates calendar event location and appends to event div
{
    loc = document.createElement("p");
    locText = document.createTextNode("Sample Location");
    loc.appendChild(locText);
    setTextStyle(loc, '10px', locColor);
    event.appendChild(loc);
}

function setTextStyle (text, fontSize, color) 
{
    text.style.color = color;
    text.style.fontSize = fontSize;
    text.style.zIndex = '2';
    text.style.paddingTop = (calendarWidth / 50) + 'px';
    text.style.paddingLeft = (calendarWidth / 100) + 'px';
    text.style.lineHeight = '0px';
}

layOutDay([
    {start: 30, end: 150}, 
    {start: 540, end: 600}, 
    {start: 560, end: 620},
    {start: 610, end: 670} 
])