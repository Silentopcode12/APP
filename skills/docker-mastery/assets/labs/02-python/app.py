import os
import time

message = os.getenv("APP_MESSAGE", "Hello from Python")

print(message)
print("Sleeping for 5 seconds to keep the container alive...")

time.sleep(5)
