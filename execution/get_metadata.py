import requests
import sys
import json

def get_metadata(status_url):
    print(f"Fetching metadata from: {status_url}")
    try:
        response = requests.get(status_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            # Navigate the JSON structure common in ICEcast status-json.xsl
            sources = data.get('icestats', {}).get('source', [])
            if isinstance(sources, dict):
                sources = [sources]
            
            # Find the relevant source
            for source in sources:
                if 'radioculturaguaira' in source.get('listenurl', ''):
                    title = source.get('title', 'Unknown Title')
                    artist = "Unknown Artist"
                    if ' - ' in title:
                        artist, title = title.split(' - ', 1)
                    
                    print(f"SUCCESS: Metadata found.")
                    print(f"Artist: {artist}")
                    print(f"Title: {title}")
                    print(f"Listeners: {source.get('listeners', 0)}")
                    return True
            
            print("WARNING: Source not found in metadata.")
            return False
        else:
            print(f"FAILED: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    url = "https://ice.fabricahost.com.br/status-json.xsl"
    if len(sys.argv) > 1:
        url = sys.argv[1]
    
    success = get_metadata(url)
    sys.exit(0 if success else 1)
