/**
 * Creates a document fragment containing formatted anchor tags for links.
 * e.g., [<a href="...">DOI</a>, <a href="...">arXiv</a>]
 * @param {Array<Object>} links - An array of link objects, each with a 'type' and 'url'.
 * @returns {DocumentFragment} A fragment to be appended to a parent element.
 */
function linksFragment(links) {
    const fragment = document.createDocumentFragment();
    if (!links || links.length === 0) {
        return fragment;
    }

    fragment.appendChild(document.createTextNode('['));
    links.forEach((link, index) => {
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', link.url);
        linkElement.textContent = link.type;
        fragment.appendChild(linkElement);

        if (index < links.length - 1) {
            // Add a comma and space between links
            fragment.appendChild(document.createTextNode(', '));
        }
    });
    fragment.appendChild(document.createTextNode(']'));
    return fragment;
}

function authorsFragment(authors) {
    const fragment = document.createDocumentFragment();

    if (authors.length > 0) {
        const text = '(with '
            + authors.slice(0, -1).join(', ')
            + ((authors.length > 1) ? ' and ' : '')
            + authors.slice(-1)
            + ")";

        fragment.appendChild(document.createTextNode(text));
        fragment.appendChild(document.createElement('br'));
    }
    return fragment;
}

function publicationFragment(publications) {
    const fragment = document.createDocumentFragment();

    for (const publication of publications) {
        const listItem = document.createElement('li');

        const title = document.createElement('b');
        title.textContent = publication.title;
        listItem.appendChild(title);
        listItem.appendChild(document.createElement('br'));

        listItem.appendChild(authorsFragment(publication.authors));

        const venueText = document.createTextNode(publication.venue);
        listItem.appendChild(venueText);
        listItem.appendChild(document.createElement('br'));

        const links = linksFragment(publication.links);
        listItem.appendChild(links);

        fragment.appendChild(listItem);
    }

    return fragment;
}

function preprintsFragment(preprints) {
    const fragment = document.createDocumentFragment();

    for (const preprint of preprints) {
        const listItem = document.createElement('li');

        const title = document.createElement('b');
        title.textContent = preprint.title;
        listItem.appendChild(title);
        listItem.appendChild(document.createElement('br'));

        listItem.appendChild(authorsFragment(preprint.authors));
        
        const links = linksFragment(preprint.links);
        listItem.appendChild(links);

        fragment.appendChild(listItem);
    }

    return fragment;
}

function talksFragment(talks) {
    const fragment = document.createDocumentFragment();

    for (const talk of talks) {
        const listItem = document.createElement('li');

        const title = document.createElement('b');
        title.textContent = talk.title;
        listItem.appendChild(title);
        listItem.appendChild(document.createElement('br'));

        listItem.appendChild(authorsFragment(talk.authors));

        talk.events.forEach((event, index) => {
            const eventText = `${event.event_name}, ${event.date}`;
            listItem.appendChild(document.createTextNode(eventText));
            // Add a semicolon separator for talks given at multiple events
            if (index < talk.events.length - 1) {
                listItem.appendChild(document.createTextNode(';'));
            } else {
                listItem.appendChild(document.createTextNode('.'));
            }
            listItem.appendChild(document.createElement('br'));
        });

        const links = linksFragment(talk.links);
        listItem.appendChild(links);

        fragment.appendChild(listItem);
    }

    return fragment;
}


async function fetchWorks() {
    // --- Fetch and parse the JSON data ---
    const response = await fetch('works.json');
    if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return;
    }
    const works = await response.json();

    document
        .querySelector('#publications ul')
        .appendChild(publicationFragment(works.publications));

    document
        .querySelector('#preprints ul')
        .appendChild(preprintsFragment(works.preprints));

    document
        .querySelector('#talks ul')
        .appendChild(talksFragment(works.talks));
}

fetchWorks()