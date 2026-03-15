from flask import Flask, request, jsonify
from flask_cors import CORS
import random, datetime, os, requests

app = Flask(__name__)
CORS(app)

GROQ_KEYS = [
    os.environ.get("GROQ_KEY_1", ""),
    os.environ.get("GROQ_KEY_2", ""),
]
IMGBB_KEY = os.environ.get("IMGBB_KEY", "")
groq_index = [0]

def get_groq_key():
    key = GROQ_KEYS[groq_index[0] % len(GROQ_KEYS)]
    groq_index[0] += 1
    return key

def scarcity():
    today = datetime.date.today()
    diff = (4 - today.weekday() + 7) % 7 or 7
    friday = today + datetime.timedelta(days=diff)
    fri = friday.strftime("%A, %b %d")
    options = [
        f"Only {random.randint(2,5)} pieces left!",
        f"Just {random.randint(1,3)} remaining at this price!",
        f"Offer closes {fri}!",
        f"Taking only {random.randint(3,7)} orders this week."
    ]
    return random.choice(options)

def build_fire(d, t):
    s = scarcity()
    if t == "single":
        p = f"{d["cur"]}{d["price"]} for {d["qty"]}" if d.get("qty") else f"{d["cur"]}{d["price"]}"
        return f"ATTENTION {d["target"].upper()}!\n\nAre you still struggling with this? The solution is right here.\n\nIntroducing *{d["product"]}*\n\n- {d["benefit"]}\n- Price: {p}\n- Delivery: {d["speed"]}\n\n{s}\n\nDo not wait. Message us NOW.\n\nReply *ORDER* and we handle the rest"
    if t == "collection":
        q = f"\n{d["qty"]} available" if d.get("qty") else ""
        return f"NEW COLLECTION DROP FOR {d["target"].upper()}!\n\nThe wait is over. Our *{d["product"]}* is finally here.\n\nPrices from {d["cur"]}{d["price"]}\nDelivery: {d["speed"]}{q}\n\n{s}\n\nComment INTERESTED or reply DROP to see the full collection now."
    if t == "clearance":
        o = f"{d["original"]}\n" if d.get("original") else ""
        return f"CLEARANCE SALE ALERT!\n\n*{d["product"]}* - {d["discount"]}\n\n{o}Sale ends: {d["end"]}\nDelivery: {d["speed"]}\n\nThis is your last chance at this price.\n\n{s}\n\nReply *SALE* now to secure your order before it closes!"
    if t == "service":
        return f"ATTENTION {d["target"].upper()}!\n\nLooking for *{d["product"]}*?\n\nHere is what you get:\n- {d["benefit"]}\n- Starting from: {d["cur"]}{d["price"]}\n- Turnaround: {d["speed"]}\n\n{s}\n\nReply *HIRE* now and let us get started."

def build_global(d, t):
    if t == "single":
        p = f"{d["cur"]}{d["price"]} for {d["qty"]}" if d.get("qty") else f"from {d["cur"]}{d["price"]}"
        return f"Hi there\n\nI wanted to share something that might be exactly what you need.\n\nWe are offering *{d["product"]}* designed for {d["target"]}.\n\nWhat it does for you:\n- {d["benefit"]}\n\nPrice: {p}\nDelivery: {d["speed"]}\n\nWe have limited availability. Reply and I will guide you through everything."
    if t == "collection":
        q = f"\n{d["qty"]} pieces available" if d.get("qty") else ""
        return f"Hello\n\nWe are excited to present our new *{d["product"]}* collection, curated for {d["target"]}.\n\nPricing starts at {d["cur"]}{d["price"]}{q}\nDelivery: {d["speed"]}\n\nThis collection is available for a limited time. Reply and I will send the full lookbook right away."
    if t == "clearance":
        o = f"\n{d["original"]}." if d.get("original") else ""
        return f"Hello\n\nWe are running a clearance on *{d["product"]}* with {d["discount"]}.{o}\n\nThis offer is available until {d["end"]}.\nDelivery: {d["speed"]}\n\nIf you have been waiting for the right price, this is it. Reply and I will help you place your order today."
    if t == "service":
        return f"Hello\n\nI provide professional *{d["product"]}* services for {d["target"]}.\n\nWhat you can expect:\n- {d["benefit"]}\n- Investment: {d["cur"]}{d["price"]}\n- Delivery: {d["speed"]}\n\nI currently have limited slots open. Reply and let us discuss how I can help you."

def groq_generate_message(form_data, msg_type, style, image_url=""):
    image_note = f"\n\nProduct image link (add at end): {image_url}" if image_url else ""
    style_note = "Nigerian Fire style: HIGH ENERGY, bold, urgent, scarcity-driven, all caps hook, emojis, built for Nigerian/African WhatsApp sellers." if style == "fire" else "Global Pro style: calm, professional, persuasive, trust-building, clean formatting, international audience."
    type_prompts = {
        "single": f"Product: {form_data.get("product")}. Price: {form_data.get("cur")}{form_data.get("price")}. Target customer: {form_data.get("target")}. Main benefit: {form_data.get("benefit")}. Delivery: {form_data.get("speed")}.",
        "collection": f"Collection: {form_data.get("product")}. Price range: {form_data.get("cur")}{form_data.get("price")}. Target: {form_data.get("target")}. Delivery: {form_data.get("speed")}.",
        "clearance": f"Product: {form_data.get("product")}. Discount: {form_data.get("discount")}. Sale price: {form_data.get("cur")}{form_data.get("price")}. Ends: {form_data.get("end")}. Delivery: {form_data.get("speed")}.",
        "service": f"Service: {form_data.get("product")}. Price: {form_data.get("cur")}{form_data.get("price")}. Client: {form_data.get("target")}. Benefit: {form_data.get("benefit")}. Turnaround: {form_data.get("speed")}."
    }
    prompt = f"""You are a WhatsApp sales message expert for African sellers.
Write ONE complete WhatsApp sales message in {style_note}
Details: {type_prompts.get(msg_type, type_prompts["single"])}{image_note}
Rules:
- Start with a powerful attention-grabbing hook
- Include urgency and scarcity naturally
- End with a clear call to action
- Keep it under 150 words
- No hashtags, no quotation marks
- Write the message directly, nothing else"""
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {get_groq_key()}"},
        json={"model": "llama-3.3-70b-versatile", "max_tokens": 300, "temperature": 0.8, "messages": [{"role": "user", "content": prompt}]},
        timeout=15
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()

def groq_smart_reply(scenario, d):
    scenarios = {
        "price": "Customer is asking to reduce the price or negotiate",
        "location": "Customer is asking where the seller is located",
        "delivery": "Customer is asking about delivery options and timing",
        "original": "Customer is asking if the product is original/authentic",
        "payment": "Customer is asking about payment methods",
        "interested": "Customer has said they are interested in buying",
        "thinking": "Customer said they want to think about it",
        "custom": f"Customer said: {d.get("custom", "")}"
    }
    prompt = f"""You are a WhatsApp sales reply expert for African sellers.
Write ONE perfect reply to: {scenarios.get(scenario, scenario)}
Seller details:
- Product: {d.get("product")}
- Price: {d.get("cur")}{d.get("price")}
- Location: {d.get("location")}
- Delivery: {d.get("delivery")}
- Payment: {d.get("payment")}
Rules: confident but friendly, under 80 words, end with next step, write reply directly"""
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {get_groq_key()}"},
        json={"model": "llama-3.3-70b-versatile", "max_tokens": 200, "temperature": 0.7, "messages": [{"role": "user", "content": prompt}]},
        timeout=15
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    t = data.get("msgType", "single")
    style = data.get("style", "fire")
    d = data.get("formData", {})
    image_url = data.get("imageUrl", "")
    try:
        if GROQ_KEYS[0]:
            msg = groq_generate_message(d, t, style, image_url)
        else:
            msg = build_fire(d, t) if style == "fire" else build_global(d, t)
    except Exception as e:
        print(f"Groq failed: {e}")
        msg = build_fire(d, t) if style == "fire" else build_global(d, t)
        if image_url:
            msg += f"\n\nProduct photo: {image_url}"
    return jsonify({"message": msg})

@app.route("/smart-reply", methods=["POST"])
def smart_reply():
    data = request.get_json()
    scenario = data.get("scenario", "")
    d = data.get("details", {})
    try:
        if GROQ_KEYS[0]:
            reply = groq_smart_reply(scenario, d)
        else:
            return jsonify({"error": "No AI key configured"}), 500
    except Exception as e:
        print(f"Groq failed: {e}")
        return jsonify({"error": "AI temporarily unavailable"}), 503
    return jsonify({"reply": reply})

@app.route("/upload-image", methods=["POST"])
def upload_image():
    if not IMGBB_KEY:
        return jsonify({"error": "Image upload not configured"}), 500
    data = request.get_json()
    b64_image = data.get("image", "")
    if not b64_image:
        return jsonify({"error": "No image provided"}), 400
    try:
        res = requests.post("https://api.imgbb.com/1/upload", data={"key": IMGBB_KEY, "image": b64_image}, timeout=20)
        result = res.json()
        if result.get("success"):
            return jsonify({"url": result["data"]["url"]})
        return jsonify({"error": "Upload failed"}), 500
    except Exception as e:
        print(f"ImgBB failed: {e}")
        return jsonify({"error": "Upload failed"}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "groq": bool(GROQ_KEYS[0]), "imgbb": bool(IMGBB_KEY)})

if __name__ == "__main__":
    app.run(debug=True)
