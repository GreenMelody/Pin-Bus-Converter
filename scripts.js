document.getElementById('convert').addEventListener('click', () => {
    const input = document.getElementById('input-pin-list').value;
    const output = convertPins(input);
    document.getElementById('output-bus-list').value = output;
});

function convertPins(input) {
    const pins = input.split('\n').filter(line => line.trim() !== '');
    const groupedPins = groupPins(pins);
    return groupedPins.join('\n');
}

function groupPins(pins) {
    const grouped = [];
    const regex = /(.*)\[(\d+)\]$/;

    let currentGroup = [];
    let currentPrefix = '';
    
    pins.forEach(pin => {
        const match = pin.match(regex);
        if (match) {
            const prefix = match[1];
            const index = parseInt(match[2], 10);

            if (prefix === currentPrefix) {
                currentGroup.push(index);
            } else {
                if (currentGroup.length > 0) {
                    grouped.push(formatGroup(currentPrefix, currentGroup));
                }
                currentPrefix = prefix;
                currentGroup = [index];
            }
        } else {
            if (currentGroup.length > 0) {
                grouped.push(formatGroup(currentPrefix, currentGroup));
            }
            grouped.push(pin);
            currentPrefix = '';
            currentGroup = [];
        }
    });

    if (currentGroup.length > 0) {
        grouped.push(formatGroup(currentPrefix, currentGroup));
    }

    return grouped;
}

function formatGroup(prefix, group) {
    group.sort((a, b) => a - b); // 오름차순으로 정렬
    const ranges = [];
    let rangeStart = group[0];

    for (let i = 1; i < group.length; i++) {
        if (group[i] !== group[i - 1] + 1) {
            ranges.push([rangeStart, group[i - 1]]);
            rangeStart = group[i];
        }
    }
    ranges.push([rangeStart, group[group.length - 1]]);

    return ranges.map(range => {
        return range[0] === range[1] ? `${prefix}[${range[0]}]` : `${prefix}[${range[1]}:${range[0]}]`;
    }).join('\n');
}
