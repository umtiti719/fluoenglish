/* İçerik verisini JSON olarak döker (seo_sayfalar.py için). Kullanım: node araclar/icerik_dok.js <çıktı.json> */
const fs=require('fs'),vm=require('vm'),path=require('path');
const src=path.join(__dirname,'..','src');
const files=['data-quiz.js','data-learn.js','data-learn2.js','data-learn2b.js','data-learn2c.js','data-learn2d.js','data-grammar.js','data-exam.js','data-grammar-c1.js','data-reading.js'];
let code=files.map(f=>fs.readFileSync(path.join(src,f),'utf8')).join('\n').replace(/^const /gm,'var ');
code+='\n;__out={LEVELS,GRAMMAR_LEVELS,GRAMMAR,DECKS,READING};';
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
fs.writeFileSync(process.argv[2],JSON.stringify(ctx.__out));
console.log('grammar',ctx.__out.GRAMMAR.length,'decks',ctx.__out.DECKS.length,'reading',ctx.__out.READING.length);
