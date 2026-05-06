// ════════════════════════════════════════════
// myFunctions.js — مطعم الأصالة (صفحة الوجبات)
// ════════════════════════════════════════════
//   ملاحظة:
//   - jQuery يُستخدم فقط لإظهار/إخفاء التفاصيل والنموذج والنافذة.
//   - باقي البرمجة بـ JavaScript عادي وبسيط.
// ════════════════════════════════════════════


// ──────────────────────────────────────────
// 1) إظهار/إخفاء تفاصيل الوجبة عند الضغط على زر "عرض التفاصيل"
// ──────────────────────────────────────────
function showDetails(button) {
  // صف التفاصيل هو الصف الذي يأتي بعد صف الوجبة مباشرة
  var detailsRow = $(button).closest('tr').next('.details-row');

  // إذا التفاصيل ظاهرة الآن => نخفيها، وإلا نُظهرها
  if (detailsRow.is(':visible')) {
    detailsRow.hide();
    button.innerText = 'عرض التفاصيل';
  } else {
    detailsRow.show();
    button.innerText = 'إخفاء التفاصيل';
  }
}


// ──────────────────────────────────────────
// 2) زر "متابعة": إظهار النموذج بعد التأكد من اختيار وجبة
// ──────────────────────────────────────────
function continueOrder() {
  // نعدّ كم وجبة مختارة
  var checkboxes = document.getElementsByClassName('meal-check');
  var count = 0;

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      count = count + 1;
    }
  }

  // إذا لا يوجد وجبة مختارة، نعرض رسالة ونخرج
  if (count === 0) {
    alert('يرجى اختيار وجبة واحدة على الأقل.');
    return;
  }

  // إظهار النموذج (jQuery)
  $('#formSection').show();
}


// ──────────────────────────────────────────
// 3) إغلاق النموذج (زر إلغاء)
// ──────────────────────────────────────────
function closeForm() {
  $('#formSection').hide();
}


// ──────────────────────────────────────────
// 4) إغلاق نافذة النجاح
// ──────────────────────────────────────────
function closeModal() {
  $('#successModal').hide();
}


// ──────────────────────────────────────────
// 5) إرسال النموذج: التحقق من المدخلات وحساب الفاتورة
// ──────────────────────────────────────────
function submitOrder() {
  // قراءة قيم الحقول
  var name   = document.getElementById('fullName').value.trim();
  var bank   = document.getElementById('bankAccount').value.trim();
  var date   = document.getElementById('orderDate').value.trim();
  var mobile = document.getElementById('mobile').value.trim();

  // متغير لتتبع صحة المدخلات
  var valid = true;

  // إخفاء كل رسائل الخطأ قبل البدء (الرسائل موجودة في HTML)
  document.getElementById('fullNameError').style.display    = 'none';
  document.getElementById('bankAccountError').style.display = 'none';
  document.getElementById('orderDateError').style.display   = 'none';
  document.getElementById('mobileError').style.display      = 'none';


  // ── (أ) الاسم الكامل (اختياري) — حروف إنكليزية، اسمان بفراغ واحد ──
  if (name !== '' && !/^[A-Za-z]+ [A-Za-z]+$/.test(name)) {
    document.getElementById('fullNameError').style.display = 'inline';
    valid = false;
  }


  // ── (ب) رقم الحساب المصرفي (إلزامي) — 6 خانات أرقام ──
  if (bank === '' || !/^[0-9]{6}$/.test(bank)) {
    document.getElementById('bankAccountError').style.display = 'inline';
    valid = false;
  }


  // ── (ج) التاريخ (اختياري) — صيغة dd-mm-yyyy ──
  if (date !== '' && !/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(date)) {
    document.getElementById('orderDateError').style.display = 'inline';
    valid = false;
  }


  // ── (د) رقم الموبايل (اختياري) — Syriatel أو MTN ──
  if (mobile !== '' && !/^09[3456789][0-9]{7}$/.test(mobile)) {
    document.getElementById('mobileError').style.display = 'inline';
    valid = false;
  }


  // إذا يوجد خطأ في أي حقل، نوقف العملية
  if (!valid) {
    return false;
  }


  // ──────────────────────────────────────────
  // حساب الفاتورة
  // ──────────────────────────────────────────
  var subtotal = 0;
  var mealsHTML = '';
  var rows = document.getElementsByClassName('meal-row');

  for (var j = 0; j < rows.length; j++) {
    var row = rows[j];

    // إذا الوجبة غير مختارة، ننتقل للصف التالي
    if (!row.getElementsByClassName('meal-check')[0].checked) continue;

    var code     = row.getElementsByClassName('col-code')[0].innerText;
    var mealName = row.getElementsByClassName('col-name')[0].innerText;
    var price    = parseInt(row.getElementsByClassName('col-price')[0].dataset.price);

    subtotal += price;
    mealsHTML += '<li>' + code + ' — ' + mealName + ' — ' + price + ' ل.س</li>';
  }

  var tax = subtotal * 0.10;   // الضريبة 10%
  var net = subtotal + tax;    // الصافي = الإجمالي + الضريبة


  // ──────────────────────────────────────────
  // ملء نافذة النجاح بالمعلومات
  // ──────────────────────────────────────────
  document.getElementById('modalMealsList').innerHTML = mealsHTML;
  document.getElementById('modalSubtotal').innerText  = subtotal + ' ل.س';
  document.getElementById('modalTax').innerText       = tax      + ' ل.س';
  document.getElementById('modalNet').innerText       = net      + ' ل.س';

  document.getElementById('modalName').innerText   = (name   === '') ? '—' : name;
  document.getElementById('modalBank').innerText   = bank;
  document.getElementById('modalDate').innerText   = (date   === '') ? '—' : date;
  document.getElementById('modalMobile').innerText = (mobile === '') ? '—' : mobile;


  // إظهار نافذة النجاح (jQuery)
  $('#successModal').show();

  // منع إعادة تحميل الصفحة بعد الإرسال
  return false;
}
