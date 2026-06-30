"""Backend API tests for Duru ULV - quotes endpoint and root health."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://teknik-hub-2.preview.emergentagent.com').rstrip('/')


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ===== Health / root =====
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "Duru" in data.get("message", "")


# ===== Quotes =====
class TestQuotes:
    def test_create_quote_success(self, api_client):
        payload = {
            "full_name": "TEST_Ahmet Yilmaz",
            "company": "TEST Co",
            "phone": "+905320659117",
            "email": "test_ahmet@example.com",
            "city": "Kayseri",
            "message": "Teklif istiyorum",
            "products": ["duru-x20", "entosis-50"],
            "kvkk_accepted": True,
        }
        r = api_client.post(f"{BASE_URL}/api/quotes", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["full_name"] == payload["full_name"]
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["products"] == payload["products"]
        assert data["kvkk_accepted"] is True
        assert "created_at" in data

        # Verify persistence via GET list
        list_r = api_client.get(f"{BASE_URL}/api/quotes")
        assert list_r.status_code == 200
        quotes = list_r.json()
        assert isinstance(quotes, list)
        assert any(q.get("id") == data["id"] for q in quotes)

    def test_create_quote_rejects_kvkk_false(self, api_client):
        payload = {
            "full_name": "TEST_NoKvkk",
            "phone": "+905320659117",
            "email": "nokvkk@example.com",
            "products": [],
            "kvkk_accepted": False,
        }
        r = api_client.post(f"{BASE_URL}/api/quotes", json=payload)
        assert r.status_code == 400
        data = r.json()
        assert "KVKK" in (data.get("detail") or "")

    def test_create_quote_missing_required(self, api_client):
        # Missing full_name
        r = api_client.post(f"{BASE_URL}/api/quotes", json={
            "phone": "+90", "email": "x@y.com", "kvkk_accepted": True
        })
        assert r.status_code == 422

    def test_quotes_no_objectid_leak(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/quotes")
        assert r.status_code == 200
        for q in r.json():
            assert "_id" not in q

    def test_create_minimal_payload(self, api_client):
        payload = {
            "full_name": "TEST_Minimal",
            "phone": "0000",
            "email": "min@example.com",
            "kvkk_accepted": True,
        }
        r = api_client.post(f"{BASE_URL}/api/quotes", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d["company"] == ""
        assert d["city"] == ""
        assert d["message"] == ""
        assert d["products"] == []
