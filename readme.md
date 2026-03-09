 To fix this and install your skills, please run the following command in an administrator terminal:

   1 Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser


  Once that's done, you can install the skills with these commands:


   1 gemini skills install databricks-spark-engineer.skill --scope workspace
   2 gemini skills install google-adk-orchestrator.skill --scope workspace

  Crucial: After installation, you MUST manually execute the /skills reload command in your terminal to activate them.