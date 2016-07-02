from flask import Flask, render_template, request
from colors import get_color_combos

DEBUG = True

app = Flask(__name__, static_folder='../static', template_folder='../templates')
app.config.from_object(__name__)

@app.route('/')
def show_colors():
  return render_template('layout.html')

@app.route('/palettes', methods=['POST'])
def show_palettes():
#   get colors here
    raw_list = request.form
    raw_list = raw_list.getlist('color[]')
    raw_list = list(set(raw_list))
#   convert list (no duplicates, at least two colors)
    color_list = [
        [   int(c.strip('rgb() ').split(',', 2)[0]),
            int(c.strip('rgb() ').split(',', 2)[1]),
            int(c.strip('rgb() ').split(',', 2)[2])
        ]
        for c in raw_list
    ]
    if(len(color_list) >= 2):
        raw_pairs = get_color_combos(color_list, 6)
        palette_pairs = [
            [   'rgb({0}, {1}, {2})'.format(p[0][0], p[0][1], p[0][2]),
                'rgb({0}, {1}, {2})'.format(p[1][0], p[1][1], p[1][2])
            ]
            for p in raw_pairs
        ]
        print(palette_pairs)
    return render_template('palettes.html', palette_pairs=palette_pairs)

if __name__ == "__main__":
  app.run()
