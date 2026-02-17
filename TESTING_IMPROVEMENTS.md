# 🧪 Testing Guide: Drag & Drop and Activity Log Improvements

## Quick Start

### Step 1: Start the Development Server
```bash
# In terminal at project root
pnpm dev
# or
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 2: Login
- **Email:** `intern@demo.com`
- **Password:** `intern123`
- **Remember Me:** Optional (for testing)

---

## Testing Scenarios

### Test 1: Activity Log Column Names

**Objective:** Verify human-readable column names in activity log

**Steps:**
1. Create a new task (click "New Task" button)
2. Fill in the form:
   - Title: "Test Feature"
   - Priority: High
   - Column: Todo
3. Click "Create Task"
4. Open the Activity Log panel (click "Activity" button in nav)

**Expected Results:**
- ✅ Activity log shows: "Created Test Feature"
- ✅ No activity shows raw column name like "todo" or "doing"
- ✅ Column names are human-readable (Todo, In Progress, Done)

---

### Test 2: Movement Details Display

**Objective:** Verify enhanced movement tracking with badges

**Steps:**
1. With the task created above visible
2. Grab the task card and drag it to the "In Progress" column
3. Look at the Activity Log panel

**Expected Visual Results:**

```
→ Moved "Test Feature"
  [Todo] → [In Progress]
  Just now
```

Specifically check:
- ✅ Source column shown as gray badge: `[Todo]`
- ✅ Arrow icon between badges
- ✅ Destination shown as purple badge: `[In Progress]`
- ✅ Proper spacing and alignment
- ✅ Time indicator shows "Just now"

**Verify Column Names:**
- ✅ "Todo" not "todo"
- ✅ "In Progress" not "doing"
- ✅ "Done" not "done"

---

### Test 3: Drag & Drop Visual Feedback (Desktop)

**Objective:** Test visual enhancements during drag operation

**Steps:**
1. Hover over a task card (without clicking)
   - ✅ Cursor should change to ✋ "grab" cursor
   - ✅ Card has subtle shadow (shadow-sm)

2. Click and hold on the task
   - ✅ Dragged element appears above with:
     - Purple ring around it
     - Noticeably larger than normal (5% scale increase)
     - Darker, heavier shadow (shadow-2xl)
     - Slight rotation (2°)
   - ✅ Original card in column fades (opacity 0.4)
   - ✅ Original card shows blur effect
   - ✅ Original card appears grayscale/muted

3. Move dragged element over a different column
   - ✅ Drop zone shows light blue background
   - ✅ Drop zone has blue dashed border
   - ✅ Visual feedback is clear where drop will occur

4. Release mouse over valid drop zone
   - ✅ Task smoothly drops into place
   - ✅ Original opacity and effects removed
   - ✅ No janky animations

---

### Test 4: Multiple Movement Tracking

**Objective:** Verify activity log tracks multiple movements accurately

**Steps:**
1. Create 2-3 more tasks with different titles
2. Move tasks between columns:
   - Task 1: Todo → In Progress
   - Task 2: Todo → Done
   - Task 3: In Progress → Done

3. Check the Activity Log

**Expected Results:**
- ✅ All movements are logged in reverse chronological order (newest first)
- ✅ Each movement shows correct source and destination
- ✅ Task names are accurately recorded
- ✅ Timestamps show relative time (Just now, 2m ago, etc.)

**Example Log Should Look Like:**
```
→ Moved "Task 3"
  [In Progress] → [Done]
  Just now

→ Moved "Task 2"
  [Todo] → [Done]
  5s ago

→ Moved "Task 1"
  [Todo] → [In Progress]
  15s ago

✓ Created "Task 3"
  2m ago
```

---

### Test 5: Responsive Drag on Mobile/Tablet

**Objective:** Verify drag and drop works smoothly on smaller screens

**Chrome DevTools Steps:**
1. Press F12 to open DevTools
2. Click device toggle or press Ctrl+Shift+M
3. Select "iPhone SE" or "iPad" device

**Test for Each Breakpoint:**

**iPhone SE (375px):**
- ✅ Drag feedback visible despite narrow screen
- ✅ Dragged element doesn't overflow viewport
- ✅ Original card blur effect still works
- ✅ Drop zones highlight properly
- ✅ Activity log displays badges correctly

**iPad (768px):**
- ✅ Horizontal scroll enables multi-column view
- ✅ Drag works across scrolled columns
- ✅ Drag overlay visible in full viewport
- ✅ Activity log shows full badge details

**Full Desktop (1440px+):**
- ✅ All columns visible simultaneously
- ✅ Drag feedback perfect with scale effect
- ✅ Ring effect clearly visible
- ✅ Drop zones properly aligned

---

### Test 6: Activity Log Scroll & Overflow

**Objective:** Verify activity log handles many entries gracefully

**Steps:**
1. Create and move 20+ tasks rapidly
2. Watch the Activity Log panel

**Expected Results:**
- ✅ Log shows max 50 most recent actions
- ✅ Scrollbar appears when log is full
- ✅ Can scroll through history
- ✅ Performance remains smooth (no lag)
- ✅ No console errors for data limits

---

### Test 7: Column Consistency

**Objective:** Verify all action types show correctly in activity log

**Steps:**
1. Perform different actions and observe activity log:

**Create Task:**
```
✓ Created "New Feature"
  2m ago
```
- ✅ Green checkmark icon
- ✅ "Created" label

**Move Task:**
```
→ Moved "New Feature"
  [Todo] → [In Progress]
  1m ago
```
- ✅ Purple arrow icon
- ✅ "Moved" label
- ✅ Badges showing movement
- ✅ Human-readable column names

**Edit Task:**
```
✎ Edited "New Feature"
  30s ago
```
- ✅ Blue edit icon
- ✅ "Edited" label

**Delete Task:**
```
✕ Deleted "Old Task"
  15s ago
```
- ✅ Red trash icon
- ✅ "Deleted" label

---

## Accessibility Testing

### Keyboard Navigation
1. Press **Tab** to navigate
   - ✅ Can reach and focus on task cards
   - ✅ Focus indicator is visible
   - ✅ Can activate drag with Space/Enter

2. Press **Escape** while dragging
   - ✅ Drag is cancelled
   - ✅ Task returns to original position

### Screen Reader Testing
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to Activity Log section

**Should Hear:**
- ✅ "Activity Log, list with N items"
- ✅ For each entry: "List item. [Action icon] [Action text] [Task name]. [Column badges]"
- ✅ Clear semantic structure

### Color & Contrast
1. Use browser DevTools (F12 → Accessibility)
2. Check contrast ratios

**Should Verify:**
- ✅ Badge text has 4.5:1 contrast (WCAG AA)
- ✅ Activity log text readable
- ✅ Colors not the only differentiator (icons + text + badges)

---

## Performance Testing

### Chrome DevTools Analysis

1. Open DevTools (F12)
2. Go to Performance tab
3. Record user action: Drag a task

**Check:**
- ✅ FPS stays at 60 (smooth 16.67ms frames)
- ✅ No long tasks (>50ms)
- ✅ GPU acceleration used (filters, transforms)
- ✅ Memory doesn't spike

### Profile Rendering

1. DevTools → Performance
2. Start recording
3. Drag task, drop it, check activity log updates
4. Stop recording

**Metrics Should Show:**
- ✅ Scripting: <50ms
- ✅ Rendering: <50ms
- ✅ Painting: <10ms
- ✅ **Total:** <100ms for entire interaction

---

## Visual Inspection Checklist

### Drag Overlay Visual
- [ ] Purple ring is visible around dragged element
- [ ] Ring color: Purple (#a855f7 area)
- [ ] Ring opacity is subtle (not overwhelming)
- [ ] Shadow is noticeably heavier than normal
- [ ] Scale effect visible (element appears bigger)
- [ ] Slight rotation visible (2°)
- [ ] No text overflow or clipping

### Original Card Feedback
- [ ] Original card fades to 40% opacity
- [ ] Blur effect is subtle (1px, not heavy)
- [ ] Grayscale effect is noticeable but not extreme
- [ ] Transitions are smooth (not instant)
- [ ] Card returns to normal smoothly on drop

### Activity Log Badges
- [ ] Source badge has gray background
- [ ] Source badge text is dark gray
- [ ] Destination badge has purple background
- [ ] Destination badge text is purple
- [ ] Arrow icon is visible between badges
- [ ] Proper padding inside badges (px-1.5 py-0.5)
- [ ] Rounded corners on badges (rounded)

### Drop Zone
- [ ] Blue background appears on hover
- [ ] Blue dashed border appears
- [ ] Color: rgb(147, 197, 253) - blue-300
- [ ] Multiple items in column still show drop feedback
- [ ] Feedback clears when moving away

---

## Animation Performance Test

### Smooth Dragging Verification

**Desktop:**
1. Open DevTools → Sources
2. Right-click on `body` → Break on → Subtree modifications
3. Drag a task slowly

**Check:**
- ✅ No breakpoints trigger (no DOM updates during drag)
- ✅ Smooth movement (no stuttering)
- ✅ Cursor feedback is immediate
- ✅ No lag when dragging over multiple columns

### CSS Transitions

1. Inspect a task card during drag
2. Look for transitions in DevTools Styles panel
3. Verify it has `transition` property

**Should See:**
```css
transition: ... 
/* or empty if not animating position */
```

---

## Known Good States

### After Create Task
```
Activity Log:
✓ Created "Task Name"
  Just now
```

### After Move Task Once
```
Activity Log:
→ Moved "Task Name"
  [Todo] → [In Progress]
  Just now

✓ Created "Task Name"
  10s ago
```

### After Move Task Multiple Times
```
Activity Log:
→ Moved "Task Name"
  [Done] → [In Progress]
  5s ago

→ Moved "Task Name"
  [In Progress] → [Done]
  8s ago

→ Moved "Task Name"
  [Todo] → [In Progress]
  15s ago

✓ Created "Task Name"
  25s ago
```

---

## Troubleshooting

### Problem: Purple ring not visible on dragged element
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild project: `pnpm dev` (restart dev server)
- Check if dark mode is enabled (should be light mode)

### Problem: Blur effect too strong or not visible
**Solution:**
- Check DevTools Styles for `filter` property
- Verify `grayscale(20%)` is present
- Try different screen brightness

### Problem: Activity log not updating after move
**Solution:**
- Check browser console for errors (F12 → Console)
- Verify localStorage is enabled
- Try creating a different task and moving it

### Problem: Column names showing as "todo" instead of "Todo"
**Solution:**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage: `localStorage.clear()` in console
- Restart dev server

### Problem: Drag feels sluggish
**Solution:**
- Close unused browser tabs
- Check Task Manager for high CPU usage
- Try fullscreen mode
- Check if animation settings are enabled

---

## Browser-Specific Notes

### Chrome/Edge (Recommended)
- ✅ Best performance
- ✅ Smooth drag animations
- ✅ DevTools are excellent
- ✅ All filters/transforms supported

### Firefox
- ✅ Good performance
- ✅ DevTools responsive
- ⚠️ Might be slightly different shadow rendering
- ✅ All filters/transforms supported

### Safari
- ✅ Works well
- ⚠️ DevTools less detailed
- ✅ Hardware acceleration excellent
- ✅ All filters/transforms supported

### Mobile Browsers
- ✅ iOS Safari: Excellent performance
- ✅ Chrome Mobile: Good performance
- ⚠️ Touch drag requires different handling
- ✅ Activity log works smoothly

---

## Quick Test Commands

Copy-paste these into browser console while app is running:

```javascript
// Check if activity log has movement records
const store = window.__ZUSTAND_STORE__;
console.log(store.getState().activityLog);

// Check column names mapping
console.log('Column names should map: todo→Todo, doing→In Progress, done→Done');

// Verify activity has new fields
const lastMove = store.getState().activityLog.find(l => l.action === 'moved');
console.log('Has fromColumn?', !!lastMove.fromColumn);
console.log('Has toColumn?', !!lastMove.toColumn);
```

---

## Test Results Template

```
Test Date: _______________
Tester: ___________________
Browser: ___________________
OS: ________________________

✅ Test 1: Activity Log Column Names
   Notes: _________________________________

✅ Test 2: Movement Details Display
   Notes: _________________________________

✅ Test 3: Drag & Drop Visual Feedback
   Notes: _________________________________

✅ Test 4: Multiple Movement Tracking
   Notes: _________________________________

✅ Test 5: Responsive Drag
   Notes: _________________________________

✅ Test 6: Activity Log Scroll
   Notes: _________________________________

✅ Test 7: Column Consistency
   Notes: _________________________________

✅ Accessibility Tests
   Notes: _________________________________

✅ Performance Tests
   Notes: _________________________________

Overall: ✅ PASS / ⚠️ NEEDS WORK / ❌ FAIL

Issues Found:
1. _______________________________
2. _______________________________
3. _______________________________
```

---

**Last Updated:** February 17, 2026  
**Status:** Ready for Testing 🚀  
**Estimated Test Time:** 15-20 minutes
