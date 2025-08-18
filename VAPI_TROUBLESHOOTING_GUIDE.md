# 🔧 Vapi.ai Voice Integration Troubleshooting Guide

## 🚨 **Quick Fix for Production Audio Issues**

### **Most Common Issue: Missing Environment Variables**

**Check your Vercel environment variables:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project settings
3. Go to "Environment Variables" section
4. Ensure these are set for **Production**, **Preview**, AND **Development**:

```bash
# REQUIRED for voice to work
NEXT_PUBLIC_VAPI_PUBLIC_KEY=vp_live_xxxxxxxxxxxxxxxxxx
VAPI_PRIVATE_KEY=sk_live_xxxxxxxxxxxxxxxxxx

# OPTIONAL (for custom workflows)
NEXT_PUBLIC_VAPI_WORKFLOW_ID=workflow_xxxxxxxxxxxxxxxxxx
```

**⚠️ CRITICAL:** Environment variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser.

---

## 🔍 **Step-by-Step Diagnosis**

### **1. Use the Debug Panel**

Navigate to `/career-forge/ai-interview-prep` and click the **🔧 Debug** button in the bottom-right corner.

**Check these indicators:**
- ✅ **Vapi Configuration > Public Key: ✅ Set** 
- ✅ **Browser Support > All items should show ✅**
- ✅ **Environment > Protocol: https** (required for production)

### **2. Browser Console Inspection**

Open Developer Tools (F12) and look for these logs:

**✅ Successful Connection:**
```bash
🔊 Audio Diagnostics:
- Vapi Public Key: Set
- Audio Context supported: true
📞 Call started
🔊 Audio Context at call start: running
🗣️ AI started speaking
🔊 Audio Context state: running
```

**❌ Failed Connection:**
```bash
❌ Vapi error: {type: "error", message: "Invalid API key"}
❌ Failed to start interview: NEXT_PUBLIC_VAPI_PUBLIC_KEY is not configured
```

### **3. Network Tab Verification**

In DevTools Network tab, check for:
- ✅ **WebSocket connections** to `wss://*.vapi.ai`
- ✅ **200 OK responses** to Vapi API endpoints
- ❌ **CORS errors** or **blocked requests**

---

## 🔧 **Common Issues & Solutions**

### **Issue 1: No Audio Output (Most Common)**

**Symptoms:**
- Call connects successfully
- Transcripts appear
- No voice audio from AI

**Solutions:**

#### **A. Environment Variables**
```bash
# Verify in Vercel dashboard these are set correctly:
NEXT_PUBLIC_VAPI_PUBLIC_KEY=vp_live_xxxxxxxxxxxxxxxxxx  # Must start with 'vp_'
VAPI_PRIVATE_KEY=sk_live_xxxxxxxxxxxxxxxxxx              # Must start with 'sk_'
```

#### **B. Browser Permissions**
- Ensure microphone permissions are granted
- Try in Chrome/Firefox (Safari may have issues)
- Test on `https://` domain (HTTP won't work in production)

#### **C. Audio Context Issues**
Add this to your browser console:
```javascript
// Check if audio context is running
console.log('Audio Context State:', vapi.audioContext?.state)

// Try to resume audio context manually
if (vapi.audioContext?.state === 'suspended') {
  vapi.audioContext.resume()
}
```

### **Issue 2: Connection Errors**

**Symptoms:**
- "Failed to start interview" errors
- WebSocket connection failures

**Solutions:**

#### **A. API Key Validation**
Verify your Vapi.ai keys in the [dashboard](https://dashboard.vapi.ai/):
- Public key should start with `vp_live_` or `vp_test_`
- Private key should start with `sk_live_` or `sk_test_`

#### **B. Vercel Configuration**
Add this `vercel.json` configuration:
```json
{
  "headers": [
    {
      "source": "/career-forge/ai-interview-prep",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "media-src 'self' blob: https://*.vapi.ai https://*.elevenlabs.ai; connect-src 'self' wss://*.vapi.ai https://*.vapi.ai"
        }
      ]
    }
  ]
}
```

### **Issue 3: Local Works, Production Doesn't**

**Common Causes:**
1. **Missing environment variables** in Vercel
2. **HTTP vs HTTPS** - voice requires HTTPS in production
3. **CSP headers** blocking media or WebSocket connections

**Solution:**
1. Deploy environment variables to Vercel
2. Ensure production uses HTTPS
3. Add proper CSP headers (included in our `vercel.json`)

---

## 🧪 **Testing Checklist**

### **Local Development:**
- [ ] Environment variables set in `.env.local`
- [ ] Microphone permissions granted
- [ ] Console shows successful connection logs
- [ ] Audio output works correctly

### **Production Deployment:**
- [ ] Environment variables set in Vercel dashboard
- [ ] HTTPS domain configured
- [ ] No CORS errors in network tab
- [ ] Audio context shows "running" state

---

## 📞 **Manual Testing Commands**

### **Test Environment Variables:**
```javascript
// Run in browser console
console.log('Public Key:', process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)
console.log('Private Key:', process.env.VAPI_PRIVATE_KEY)
console.log('Workflow ID:', process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID)
```

### **Test Audio Context:**
```javascript
// Check audio support
console.log('AudioContext:', typeof AudioContext !== 'undefined')
console.log('WebAudio supported:', typeof window.AudioContext !== 'undefined')

// Test Vapi instance
console.log('Vapi instance:', !!vapi)
console.log('Vapi methods:', Object.keys(vapi))
```

### **Test Microphone Access:**
```javascript
// Test microphone permissions
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('✅ Microphone access granted')
    stream.getTracks().forEach(track => track.stop())
  })
  .catch(error => console.error('❌ Microphone denied:', error))
```

---

## 🔗 **Useful Resources**

- **Vapi.ai Documentation:** https://docs.vapi.ai/
- **Vapi.ai Dashboard:** https://dashboard.vapi.ai/
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
- **WebRTC Troubleshooting:** https://webrtc.github.io/samples/

---

## 🆘 **Still Having Issues?**

### **Collect Debug Information:**

1. Open browser DevTools (F12)
2. Navigate to AI Interview Prep page
3. Click "Debug" button and screenshot the panel
4. Copy all console logs during a call attempt
5. Check Network tab for failed requests

### **Common Debug Output:**

**✅ Working Configuration:**
```
🔊 Audio Diagnostics:
- Vapi Public Key: Set
- Audio Context supported: true
- WebSocket supported: true
📞 Call started
🗣️ AI started speaking
```

**❌ Broken Configuration:**
```
🔊 Audio Diagnostics:
- Vapi Public Key: Missing
❌ Failed to start interview: Invalid API key
```

---

**🎯 95% of audio issues are resolved by correctly setting environment variables in Vercel dashboard!**