from flask import Flask, request, jsonify
from flask_cors import CORS
import random, datetime

app = Flask(__name__)
CORS(app)

def scarcity():
    today = datetime.date.today()
    diff = (4 - today.weekday() + 7) % 7 or 7
    friday = today + datetime.timedelta(days=diff)
    fri = friday.strftime('%A, %b %d')
    options = [
        f"Only {random.randint(2,5)} pieces left!",
        f"Just {random.randint(1,3)} remaining at this price!",
        f"Offer closes {fri}!",
        f"Taking only {random.randint(3,7)} orders this week."
    ]
    return random.choice(options)

def build_fire(d, t):
    s = scarcity()
    if t == 'single':
        p = f"{d['cur']}{d['price']} for {d['qty']}" if d.get('qty') else f"{d['cur']}{d['price']}"
        return f"ATTENTION {d['target'].upper()}!\n\nAre you still struggling with this? The solution is right here.\n\nIntroducing *{d['product']}*\n\n- {d['benefit']}\n- Price: {p}\n- Delivery: {d['speed']}\n\n{s}\n\nDo not wait. Message us NOW.\n\nReply *ORDER* and we handle the rest"
    if t == 'collection':
        q = f"\n{d['qty']} available" if d.get('qty') else ''
        return f"NEW COLLECTION DROP FOR {d['target'].upper()}!\n\nThe wait is over. Our *{d['product']}* is finally here.\n\nPrices from {d['cur']}{d['price']}\nDelivery: {d['speed']}{q}\n\n{s}\n\nComment INTERESTED or reply DROP to see the full collection now."
    if t == 'clearance':
        o = f"{d['original']}\n" if d.get('original') else ''
        return f"CLEARANCE SALE ALERT!\n\n*{d['product']}* - {d['discount']}\n\n{o}Sale ends: {d['end']}\nDelivery: {d['speed']}\n\nThis is your last chance at this price.\n\n{s}\n\nReply *SALE* now to secure your order before it closes!"
    if t == 'service':
        return f"ATTENTION {d['target'].upper()}!\n\nLooking for *{d['product']}*?\n\nHere is what you get:\n- {d['benefit']}\n- Starting from: {d['cur']}{d['price']}\n- Turnaround: {d['speed']}\n\n{s}\n\nReply *HIRE* now and let us get started."

def build_global(d, t):
    if t == 'single':
        p = f"{d['cur']}{d['price']} for {d['qty']}" if d.get('qty') else f"from {d['cur']}{d['price']}"
        return f"Hi there\n\nI wanted to share something that might be exactly what you need.\n\nWe are offering *{d['product']}* designed for {d['target']}.\n\nWhat it does for you:\n- {d['benefit']}\n\nPrice: {p}\nDelivery: {d['speed']}\n\nWe have limited availability. Reply and I will guide you through everything."
    if t == 'collection':
        q = f"\n{d['qty']} pieces available" if d.get('qty') else ''
        return f"Hello\n\nWe are excited to present our new *{d['product']}* collection, curated for {d['target']}.\n\nPricing starts at {d['cur']}{d['price']}{q}\nDelivery: {d['speed']}\n\nThis collection is available for a limited time. Reply and I will send the full lookbook right away."
    if t == 'clearance':
        o = f"\n{d['original']}." if d.get('original') else ''
        return f"Hello\n\nWe are running a clearance on *{d['product']}* with {d['discount']}.{o}\n\nThis offer is available until {d['end']}.\nDelivery: {d['speed']}\n\nIf you have been waiting for the right price, this is it. Reply and I will help you place your order today."
    if t == 'service':
        return f"Hello\n\nI provide professional *{d['product']}* services for {d['target']}.\n\nWhat you can expect:\n- {d['benefit']}\n- Investment: {d['cur']}{d['price']}\n- Delivery: {d['speed']}\n\nI currently have limited slots open. Reply and let us discuss how I can help you."

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    t = data.get('msgType', 'single')
    style = data.get('style', 'fire')
    d = data.get('formData', {})
    msg = build_fire(d, t) if style == 'fire' else build_global(d, t)
    return jsonify({'message': msg})

if __name__ == '__main__':
    app.run(debug=True)

