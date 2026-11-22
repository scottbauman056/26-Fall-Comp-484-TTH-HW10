// NOTE: All Project 2 comments have been removed from this file so the
// changes made for HW 10 are easy to identify. Every comment below
// describes a DevTools addition.

$(function() {
    // Log Custom: %c applies the CSS in the second argument to the text after it
    console.log('%cCoco is awake', 'background: #1C2026; color: #EDEDF2; border: 2px solid #9AA3AD; padding: 4px 10px; font-size: 14px;');

    checkAndUpdatePetInfoInHtml();

    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.nap-button').click(clickedNapButton);

    // Buttons for the messages the browser logs on its own
    $('.cause-404-button').click(cause404);
    $('.cause-error-button').click(causeTypeError);
    $('.cause-violation-button').click(causeViolation);
});

const minWeight = 400;
const maxWeight = 1000;
const maxEnergy = 10;

// Declared here with let instead of var so that the pet_info shows up in the
// Scope pane's Script section, next to the limits, rather than being buried
// among a bunch of browser properties in the Global section
let pet_info = {name: "Coco", weight: "700", happiness: 5, energy: 5};

function clickedTreatButton() {
    // Log Group: every message from this click is collected under one label.
    // The other three click functions all use the same group/groupEnd pair
    console.group('Treat');

    if (pet_info['weight'] >= maxWeight) {
        showPetComment("\"Coco is full! Cease your offerings, peasant!\"");
    } else {
        pet_info['happiness'] += 2;
        pet_info['weight'] += 20;
        checkAndUpdatePetInfoInHtml();
        showPetComment("\"Coco is pleased by your offering!\"");
    }

    console.groupEnd();
}

function clickedPlayButton() {
    console.group('Play');

    const wasAtMinWeight = pet_info['weight'] <= minWeight;

    pet_info['happiness'] += 1;
    pet_info['weight'] -= 10;
    pet_info['energy'] -= 1;
    checkAndUpdatePetInfoInHtml();

    if (wasAtMinWeight) {
        showPetComment("Coco is eyeing you hungrily.");
    } else {
        showPetComment("\"Coco will deign to play with you briefly.\"");
    }

    console.groupEnd();
}

function clickedExerciseButton() {
    console.group('Exercise');

    const wasAtMinWeight = pet_info['weight'] <= minWeight;

    pet_info['happiness'] -= 1;
    pet_info['weight'] -= 20;
    pet_info['energy'] -= 2;
    checkAndUpdatePetInfoInHtml();

    if (wasAtMinWeight) {
        showPetComment("Coco is eyeing you hungrily.");
    } else {
        showPetComment("Coco exercises for a while. He definitely isn't training to escape... right?");
    }

    console.groupEnd();
}

function clickedNapButton() {
    console.group('Nap');

    pet_info['energy'] += 2;
    checkAndUpdatePetInfoInHtml();
    showPetComment("Coco takes a brief nap and dreams of vengeance.");

    console.groupEnd();
}

function checkAndUpdatePetInfoInHtml() {
    checkStatsBeforeUpdating();
    updatePetInfoInHtml();
}

function checkStatsBeforeUpdating() {
    // Log Error: it's logged whenever weight goes out of bounds and has to be
    // reset and the message includes the bad value before it's corrected
    if (pet_info['weight'] < minWeight) {
        console.error('Weight went below the minimum (' + pet_info['weight'] + '). Reset to ' + minWeight + '.');
        pet_info['weight'] = minWeight;
    } else if (pet_info['weight'] > maxWeight) {
        console.error('Weight went above the maximum (' + pet_info['weight'] + '). Reset to ' + maxWeight + '.');
        pet_info['weight'] = maxWeight;
    }

    if (pet_info['happiness'] < 0) {
        pet_info['happiness'] = 0;
    }

    if (pet_info['energy'] < 0) {
        pet_info['energy'] = 0;
    } else if (pet_info['energy'] > maxEnergy) {
        pet_info['energy'] = maxEnergy;
    }

    // Log Warning: just a heads-up that Exercise is locked until Coco naps
    if (pet_info['energy'] < 2) {
        console.warn('Coco is low on energy (' + pet_info['energy'] + '). Exercise is unavailable until he naps.');
    }
}

function updatePetInfoInHtml() {
    $('.name').text(pet_info['name']);
    $('.weight').text(pet_info['weight']);
    $('.happiness').text(pet_info['happiness']);
    $('.energy').text(pet_info['energy']);

    $('.play-button').prop('disabled', pet_info['energy'] < 1);
    $('.exercise-button').prop('disabled', pet_info['energy'] < 2);

    // Log Table: Coco's current stats after every update, one row per stat
    console.table(pet_info);
}

function showPetComment(comment) {
    // Log Info: every comment Coco shows on the page is also logged
    console.log(comment);

    $('.pet-comment').stop('comment', true, true)
        .text(comment)
        .fadeTo({duration: 200, queue: 'comment'}, 1)
        .delay(2000, 'comment')
        .fadeTo({duration: 400, queue: 'comment'}, 0)
        .dequeue('comment');
}

// Cause 404: this requests a file that doesn't exist in the repo. The browser
// will log the failed request on its own as a network error
function cause404() {
    fetch('missing-file.json');
}

// Cause TypeError: .pet-mood doesn't exist so the querySelector returns null
// throwing an uncaught TypeError
function causeTypeError() {
    document.querySelector('.pet-mood').textContent = 'Grumpy';
}

// Cause Violation: this keeps the click handler busy for 3 seconds and chrome
// flags handlers that take too long; Verbose log level has to be on to see it
function causeViolation() {
    const start = Date.now();
    while (Date.now() - start < 3000) {
        // Intentionally left empty: the loop only exists to take up time
    }
}
