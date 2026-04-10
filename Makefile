.PHONY: help install serve test eval rl-dataset clean

help: ## Show this help menu
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install required dependencies
	pip install -r server/requirements.txt

serve: ## Run the OpenEnv FastAPI Server Locally
	uvicorn server.app:app --host 0.0.0.0 --port 7860 --reload

test: ## Run local boundary tests for the reward engine
	python test_scores.py

eval: ## Run the baseline OpenEnv reference evaluator
	python inference.py

rl-dataset: ## Run the trajectory collection script for Supervised Fine-Tuning
	python collect_trajectories.py

clean: ## Remove python cache files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
