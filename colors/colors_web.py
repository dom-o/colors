from flask import Flask, render_template, request

DEBUG = True

app = Flask(__name__, static_folder='../static', template_folder='../templates')
app.config.from_object(__name__)

@app.route('/')
def show_colors():
  return render_template('layout.html')

#@app.route('/palettes', methods=['POST'])
#def show_palettes():
#   get colors here
#    color_list = request.args
#   sanitize list (no duplicates, at least two colors)
#   palette_pairs = get_color_combos(color_list, 6)
 #  return render_template('palettes.html', palette_pairs=palette_pairs)

if __name__ == "__main__":
  app.run()
