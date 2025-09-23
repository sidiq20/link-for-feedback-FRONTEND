#!/usr/bin/env python3
"""
Debug script to test form creation and link generation
"""
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_auth_and_form_creation():
    """Test authentication and form creation flow"""
    
    # Test login
    login_data = {
        "email": "mujeebahmadtesting12@gmail.com", 
        "password": "123456789"
    }
    
    print("🔐 Testing login...")
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    
    if response.status_code != 200:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return None, None
    
    auth_data = response.json()
    access_token = auth_data["access_token"]
    print("✅ Login successful")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Test form creation
    form_data = {
        "title": "Debug Test Form",
        "description": "Testing form creation and link generation",
        "questions": [
            {
                "type": "radio",
                "question": "What's your favorite color?",
                "options": ["Red", "Blue", "Green", "Yellow"]
            }
        ]
    }
    
    print("\n📝 Creating form...")
    response = requests.post(f"{BASE_URL}/api/forms/", json=form_data, headers=headers)
    
    if response.status_code != 201:
        print(f"❌ Form creation failed: {response.status_code}")
        print(response.text)
        return access_token, None
    
    form_response = response.json()
    print("✅ Form created successfully")
    print(f"Form response: {json.dumps(form_response, indent=2)}")
    
    # CRITICAL: Extract ONLY the form_id string, not the whole object
    form_id = form_response["form_id"]
    print(f"\n🔑 Form ID extracted: '{form_id}' (type: {type(form_id)})")
    
    # Test getting forms list to see the structure
    print("\n📋 Getting forms list...")
    response = requests.get(f"{BASE_URL}/api/forms/", headers=headers)
    
    if response.status_code == 200:
        forms = response.json()
        print(f"✅ Forms list retrieved. Count: {len(forms)}")
        if forms:
            latest_form = forms[-1]  # Get the latest form
            print(f"Latest form structure: {json.dumps(latest_form, indent=2)}")
            print(f"Latest form _id: '{latest_form.get('_id')}' (type: {type(latest_form.get('_id'))})")
    
    return access_token, form_id

def test_form_link_creation(access_token, form_id):
    """Test form link creation with proper form ID"""
    
    if not access_token or not form_id:
        print("❌ Cannot test form link creation - missing auth token or form ID")
        return
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Test form link creation
    link_data = {"expires_in_days": 30}
    
    print(f"\n🔗 Creating form link for form ID: '{form_id}'")
    print(f"URL: {BASE_URL}/api/form-links/{form_id}")
    
    response = requests.post(f"{BASE_URL}/api/form-links/{form_id}", json=link_data, headers=headers)
    
    print(f"Response status: {response.status_code}")
    print(f"Response text: {response.text}")
    
    if response.status_code == 201:
        link_response = response.json()
        print("✅ Form link created successfully")
        print(f"Link response: {json.dumps(link_response, indent=2)}")
        
        slug = link_response["slug"]
        print(f"🌐 Public form URL: {BASE_URL}/p/{slug}")
        
        return slug
    else:
        print(f"❌ Form link creation failed: {response.status_code}")
        return None

def test_form_results(access_token, form_id):
    """Test form results endpoints"""
    
    if not access_token or not form_id:
        print("❌ Cannot test form results - missing auth token or form ID")
        return
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    print(f"\n📊 Testing form results for form ID: '{form_id}'")
    
    # Test getting individual form with response count
    print("\n🔍 Getting individual form...")
    response = requests.get(f"{BASE_URL}/api/forms/{form_id}", headers=headers)
    
    if response.status_code == 200:
        form = response.json()
        print(f"✅ Form retrieved with response count: {form.get('response_count', 'NOT SET')}")
        print(f"Form keys: {list(form.keys())}")
    else:
        print(f"❌ Failed to get form: {response.status_code}")
        print(response.text)
    
    # Test form response list endpoint
    print(f"\n📋 Getting form responses...")
    response = requests.get(f"{BASE_URL}/api/form-response/form/{form_id}", headers=headers)
    
    if response.status_code == 200:
        responses = response.json()
        print(f"✅ Form responses retrieved. Count: {len(responses)}")
        if responses:
            print(f"First response: {json.dumps(responses[0], indent=2, default=str)}")
    else:
        print(f"❌ Failed to get responses: {response.status_code}")
        print(response.text)
    
    # Test poll results endpoint
    print(f"\n📈 Getting poll results...")
    response = requests.get(f"{BASE_URL}/api/form-response/results/{form_id}")
    
    if response.status_code == 200:
        results = response.json()
        print(f"✅ Poll results retrieved: {json.dumps(results, indent=2)}")
    else:
        print(f"❌ Failed to get poll results: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    print("🧪 Starting form creation, link generation, and results debug test...\n")
    
    access_token, form_id = test_auth_and_form_creation()
    
    if access_token and form_id:
        slug = test_form_link_creation(access_token, form_id)
        
        if slug:
            print(f"\n🎉 Form and link creation successful!")
            print(f"Form ID: {form_id}")
            print(f"Slug: {slug}")
            
            # Test form results
            test_form_results(access_token, form_id)
        else:
            print(f"\n❌ Form link creation failed")
    else:
        print(f"\n❌ Test failed at form creation stage")
