const fs = require('fs');

function fromBase(value, base) {
    return parseInt(value, base);
}

function calculateConstantTerm(points) {
    const n = points.length;
    let c = 0;

    for (let i = 0; i < n; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= (0 - points[j].x) / (xi - points[j].x);
            }
        }
        c += li * yi;
    }
    
    return Math.round(c); 
}


function main() {
    const testCases = ['test1.json', 'test2.json'];

    testCases.forEach(file => {
        try {
            const data = fs.readFileSync(file, 'utf8');
            const jsonData = JSON.parse(data);

            const n = jsonData.keys.n;
            const points = [];

            for (let i = 1; i <= n; i++) {
                const entry = jsonData[i];

                if (entry && entry.base && entry.value) {
                    const base = parseInt(entry.base);
                    const value = entry.value;

                    const decodedValue = fromBase(value, base);
                    
                    points.push({ x: i, y: decodedValue });
                } else {
                    console.error(`Entry ${i} in ${file} is missing required properties.`);
                }
            }

            if (points.length >= jsonData.keys.k) {
                const secretC = calculateConstantTerm(points);
                console.log(`The constant term c for ${file} is: ${secretC}`);
            } else {
                console.error(`Not enough valid points in ${file} to calculate c.`);
            }
        } catch (error) {
            console.error(`Error processing ${file}: ${error.message}`);
        }
    });
}

main();
