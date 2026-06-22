const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace filters title and items using regex to avoid exact string encoding mismatch
const filterRegex = /<span className="text-xs text-stone-500 font-extrabold mr-2 uppercase tracking-wide">.*?<\/span>\s*<div className="flex gap-1.5 font-sans">\s*\{\[\s*\{\s*key:\s*"heated_pool"[\s\S]*?\].map\(\(item\)\s*=>\s*\{/s;

const newFilter = `<span className="text-xs text-stone-500 font-extrabold mr-2 uppercase tracking-wide">
                    Filtre :
                  </span>
                  <div className="flex gap-1.5 font-sans">
                    {[
                      { key: "heated_pool", label: "Havuz", icon: "♨️" },
                      { key: "jacuzzi", label: "Jakuzi", icon: "🛁" },
                      { key: "pet_friendly", label: "Evcil Dostu", icon: "🐾" },
                    ].map((item) => {`;

if (filterRegex.test(content)) {
    content = content.replace(filterRegex, newFilter);
    fs.writeFileSync('src/App.tsx', content, 'utf8');
    console.log('Filters updated successfully.');
} else {
    console.log('Could not find the filter block.');
}
