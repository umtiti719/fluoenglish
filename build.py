"""src/ klasöründeki parçaları tek dosyalık index.html olarak birleştirir: python3 build.py"""
from pathlib import Path
src=Path(__file__).parent/'src'
shell=(src/'shell.html').read_text()
css=(src/'style.css').read_text()
js='\n'.join((src/f).read_text() for f in ['data-quiz.js','data-learn.js','data-grammar.js','app.js'])
out=shell.replace('/*CSS*/',css).replace('/*JS*/',js)
(Path(__file__).parent/'index.html').write_text(out)
print('index.html', len(out)//1024, 'KB')
