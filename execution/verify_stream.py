import requests
import sys
import time

def verify_stream(url):
    print(f"Verifying stream at: {url}")
    try:
        start_time = time.time()
        # We only want the headers to see if it's a valid stream
        response = requests.get(url, stream=True, timeout=10)
        latency = (time.time() - start_time) * 1000
        
        if response.status_code == 200:
            content_type = response.headers.get('Content-Type', '')
            if 'audio' in content_type or 'mpeg' in content_type or 'octet-stream' in content_type:
                print(f"SUCCESS: Stream is active.")
                print(f"Latency: {latency:.2f}ms")
                print(f"Content-Type: {content_type}")
                print(f"Server: {response.headers.get('Server', 'Unknown')}")
                return True
            else:
                print(f"WARNING: URL reachable but Content-Type is {content_type}")
                return False
        else:
            print(f"FAILED: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    stream_url = "https://ice.fabricahost.com.br/radioculturaguaira"
    if len(sys.argv) > 1:
        stream_url = sys.argv[1]
    
    success = verify_stream(stream_url)
    sys.exit(0 if success else 1)
