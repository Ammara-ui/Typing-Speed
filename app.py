from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Sample exercise
typing_exercises = [
    {"id": 1, "text": "def hello_world():\n    print('Hello, World!')"},
    {"id": 2, "text": "for i in range(10):\n    print(i)"},
    {"id": 3, "text": '''# Fibonacci sequence function in Python
def fibonacci(n):
    first_term, second_term = 0, 1
    print("Fibonacci Series up to", n, "terms:")

    for _ in range(n):
        print(first_term, end=', ')

        # Compute the next term
        next_term = first_term + second_term
        first_term = second_term
        second_term = next_term
    print()  # Print a newline at the end

# Calling the function
fibonacci(10)
'''},
]


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_exercise', methods=['GET'])
def get_exercise():
    import random
    exercise = typing_exercises[0]
    return jsonify(exercise)

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json
    user_input = data['user_input']
    target_text = data['target_text']

    # Calculate metrics
    errors = sum(1 for i, char in enumerate(user_input) if i < len(target_text) and char != target_text[i])
    accuracy = (1 - errors / max(len(target_text), 1)) * 100
    wpm = len(user_input.split()) / (data['time_taken'] / 60)

    return jsonify({"accuracy": accuracy, "wpm": wpm, "errors": errors})

if __name__ == '__main__':
    app.run(debug=True)
