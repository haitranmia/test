<script>
  // Define spreadsheet URL.
  var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1SmXL5EeJBodGhJcqIDIYiYWZ0AAR_QRNWHzsXcelYNA/edit#gid=625431259';

  var listenButton = document.getElementById("listen");
  var stopButton = document.getElementById("stop");
  var textAContent = ''; // Lưu nội dung của Text A
  var textBContent = ''; // Lưu nội dung của Text B
  var speechRate = 1.0; // Tốc độ đọc mặc định (1.0 là bình thường)
  var isReading = false; // Biến để kiểm tra trạng thái đang đọc

  // Thêm sự kiện click cho nút "Listen"
listenButton.addEventListener("click", function () {
  if (!isReading) {
    // Tạo một đối tượng lời nói
    var speechSynthesis = window.speechSynthesis;
    var lang = "vi-VN";

    // Phát âm thanh
    var audioElement = document.getElementById("backgroundAudio");
    audioElement.play();

    // Đợi 8 giây sau khi âm thanh bắt đầu phát
    setTimeout(function () {
      // Đọc đoạn văn bản "Mời bạn nghe về"
      var speechUtteranceIntro = new SpeechSynthesisUtterance();
      speechUtteranceIntro.text = "Mời bạn nghe về";
      speechUtteranceIntro.lang = lang;
      speechUtteranceIntro.rate = speechRate; // Tốc độ đọc bình thường
      speechSynthesis.speak(speechUtteranceIntro);

      // Đọc Text A với giọng lớn hơn
      var speechUtteranceA = new SpeechSynthesisUtterance();
      speechUtteranceA.text = textAContent;
      speechUtteranceA.lang = lang;
      speechUtteranceA.rate = speechRate * 0.8; // Tốc độ đọc Text A nhanh hơn

      // Sử dụng sự kiện "end" của speechUtteranceA để theo dõi khi đọc Text A kết thúc
      speechUtteranceA.onend = function () {
        // Đọc Text B với giọng bình thường
        var speechUtteranceB = new SpeechSynthesisUtterance();
        speechUtteranceB.text = textBContent;
        speechUtteranceB.lang = lang;
        speechUtteranceB.rate = speechRate * 0.9; // Tốc độ đọc Text B bình thường

        // Sử dụng sự kiện "end" của speechUtteranceB để theo dõi khi đọc Text B kết thúc
        speechUtteranceB.onend = function () {
          // Phát audio thứ hai sau khi kết thúc đọc Text B
          var audioElement2 = document.getElementById("backgroundAudio2");
          audioElement2.play();
        };

        speechSynthesis.speak(speechUtteranceB);
        isReading = true;
      };

      speechSynthesis.speak(speechUtteranceA);
    }, 8000); // Chờ 8 giây sau khi âm thanh bắt đầu phát
  }
});
  
  
  // Phát âm thanh
    var audioElement = document.getElementById("backgroundAudio2");
    audioElement.play();

  // Thêm sự kiện click cho nút "Stop"
  stopButton.addEventListener("click", function () {
    var speechSynthesis = window.speechSynthesis;
    if (isReading) {
      speechSynthesis.cancel(); // Hủy đọc
      isReading = false;
    }
  });

 var loadData = function () {
  $('#data').sheetrock({
    url: mySpreadsheet,
    query: "select A,B,C",
    callback: function (error, options, response) {
      if (!error) {
        var rows = response.rows;
        var randomIndex = Math.floor(Math.random() * rows.length);
        var row = rows[randomIndex];
        textAContent = formatText(row.cellsArray[0]);
        textBContent = formatText(row.cellsArray[1]);
        textCContent = formatText(row.cellsArray[2]);

        $('#data').empty();

        // Hiển thị Text A và Text B
       
         $('#data').append("<p style='text-align: center;font-size: 26px; font-weight:bold; color: grey '>" + "Chuyên mục: " + textBContent +"</p>");
        $('#data').append("<p style='text-align: center;font-size: 35px; font-weight:bold; '>" + textAContent + "</p>");
        $('#data').append("<p style='text-align: center; font-size: 28px; '>" + textCContent + "</p>");

        
      }
    }
  });
};
  
 
function formatText(text) {
  // Sử dụng biểu thức chính quy để thay thế ## và @@ bằng xuống 2 dòng
  text = text.replace(/##/g, '\n\n ').replace(/@@/g, '\n\n ').replace(/&&/g, '\n\n\n\n').replace(/#1#(.*?)#2#/g, '<strong>$1</strong>');
  

  
  return text;
}
  


  $('#next').click(function () {
    location.reload(); // Tự động làm mới trang khi nhấp vào nút "Next"
  });

  // Thêm sự kiện cho việc điều chỉnh tốc độ đọc
  $('#speed').change(function () {
    speechRate = parseFloat($('#speed').val());
  });
  

  loadData();
  
  // Thêm sự kiện change cho dropdown
  var dropdown = document.getElementById("dropdown");
  dropdown.addEventListener("change", function () {
    var selectedOption = dropdown.options[dropdown.selectedIndex];
    var url = selectedOption.value;
    window.location.href = url; // Chuyển đến trang cụ thể khi lựa chọn từ dropdown
  });
  

  
// Thêm sự kiện sau khi trang đã load xong dữ liệu
$(window).on('load', function () {
  // Đợi 1 giây sau khi load xong dữ liệu, sau đó dừng âm thanh
  setTimeout(function () {
    var audioElement = document.getElementById("backgroundAudio");
    var audioElement2 = document.getElementById("backgroundAudio2");
    var speechSynthesis = window.speechSynthesis;

    // Dừng phát âm thanh và hủy đọc nếu đang có
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    if (audioElement2) {
      audioElement2.pause();
      audioElement2.currentTime = 0;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      isReading = false;
    }
  }, 1000); // Chờ 1 giây trước khi dừng âm thanh
});
  
  // Thêm sự kiện sau khi trang đã load xong dữ liệu
$(window).on('load', function () {
  // Hiển thị thông báo
  var notification = document.getElementById("notification");
  notification.style.display = "block";

  // Ẩn thông báo sau 1 giây
  setTimeout(function () {
    notification.style.display = "none";
  }, 2500);
});

  
</script>