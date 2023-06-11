from flask import Flask, request, jsonify
import os
from tasks import process_route
from celery.result import AsyncResult

app = Flask(__name__)
BUCKET_NAME = 'artifacts-ai-nation'
# The dictionary for storing Celery task ids
task_ids = {}

@app.route('/')
def health_check():
    return "Service is running"

@app.route('/process', methods=['POST'])
def process_task():
    data = request.get_json()
    audioPath = data['audioPath']
    imagePath = data['imagePath']
    input_data = {"audioPath": audioPath, "imagePath": imagePath}

    try:
        task = process_route.delay(input_data)
        task_id = task.id
        # Store the task id
        task_ids[task_id] = task
        return jsonify({'message': 'Task has been submitted', 'task_id': task_id}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/result/<task_id>', methods=['GET'])
def get_result(task_id):
    # Get the task from the stored dictionary
    task = task_ids.get(task_id)
    if task is None:
        return jsonify({'message': 'Task not found'}), 404
    else:
        if task.ready():
            return jsonify({'result': f"https://storage.googleapis.com/{BUCKET_NAME}/{task.get()}"}), 200
        else:
            return jsonify({'message': 'Task not yet ready'}), 202

if __name__ == '__main__':
    app.run(debug=True, port=6006)
