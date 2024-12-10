App = {
  
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  // Hàm khởi tạo ứng dụng
  init: function() {
    return App.initWeb3();
  },

  // Khởi tạo Web3 và thiết lập nhà cung cấp
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // Nếu đã có một phiên bản web3 từ MetaMask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Sử dụng nhà cung cấp mặc định (nếu không có MetaMask)
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  // Khởi tạo hợp đồng
  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      return App.render();
    });
  },

  // Lắng nghe sự kiện được phát ra từ hợp đồng
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
      }).watch(function(error, event) {
        if (!error) {
          console.log("Sự kiện được kích hoạt:", event);
          // Gọi lại hàm render để cập nhật giao diện khi có phiếu mới
          App.render();
        } else {
          console.warn("Lỗi sự kiện:", error);
        }
      });
    });
  },

  // Hiển thị giao diện người dùng
  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var topCandidatesContainer = $("#topCandidates"); // Thêm biến để lấy phần tử hiển thị top 3

    loader.show();
    content.hide();
    topCandidatesContainer.empty(); // Đảm bảo phần này trống trước khi cập nhật

    // Tải dữ liệu tài khoản
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Địa chỉ tài khoản của bạn: " + account);
      }
    });

    // Tải dữ liệu ứng cử viên từ hợp đồng
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      var candidatesSelect = $('#candidatesSelect');
      var totalVotes = 0; // Biến để tính tổng số phiếu

      // Xóa nội dung cũ để tránh lặp lại
      candidatesResults.empty();
      candidatesSelect.empty();

      var candidatePromises = [];
      for (var i = 1; i <= candidatesCount; i++) {
        candidatePromises.push(electionInstance.candidates(i));
      }

      // Đợi tất cả lời hứa được hoàn thành
      Promise.all(candidatePromises).then(function(candidates) {

        // Sắp xếp các ứng cử viên theo số phiếu từ cao đến thấp
        candidates.sort(function(a, b) {
          return b[4].toNumber() - a[4].toNumber();
        });
/*
        // Xóa nội dung trước khi hiển thị top 3 ứng viên
      topCandidatesContainer.empty(); // Làm rỗng phần tử để tránh lặp

        // Hiển thị top 3 ứng viên
        var top3Candidates = candidates.slice(0, 3); // Lấy 3 ứng viên đầu tiên
        
        top3Candidates.forEach(function(candidate, index) {
          var name = candidate[1];
          var voteCount = candidate[4].toNumber();
          var imageURL = candidate[2];
  
          var podiumColors = ['gold', 'silver', '#cd7f32']; // Màu sắc podium: vàng, bạc, đồng
          var topTemplate = `
            <div style="text-align: center; width: 30%;">
              <img src="${imageURL}" alt="${name}" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${podiumColors[index]};">
              <h3 style="margin-top: 10px; color: ${podiumColors[index]};">${name}</h3>
              <p style="font-size: 1.2rem; font-weight: bold;">${voteCount} phiếu</p>
            </div>
          `;
          topCandidatesContainer.append(topTemplate);
        });
*/
        // Hiển thị top 3 ứng viên
        topCandidatesContainer.empty(); // Đảm bảo không có nội dung cũ

        var top3Candidates = candidates.slice(0, 3); // Lấy 3 ứng viên đầu tiên
        var topTemplate = `
          <style>
            .hover-page {
              transition: 0.2s ease-in !important;
            }
            .hover-page:hover {
              transform: scale(1.1) !important;
            }
          </style>

          <div style="display: flex; justify-content: center; align-items: flex-end; gap: 40px; padding-top: 30px; position: relative;">
            
            <div class="hover-page" style="text-align: center; width: 30%; background: linear-gradient(135deg, #e0e0e0, #ffffff); border-radius: 15px; padding: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
              <img src="${top3Candidates[1][2]}" alt="${top3Candidates[1][1]}" 
                  style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid silver;">
              <h3 style="margin-top: 10px; color: silver; font-weight: bold;">${top3Candidates[1][1]}</h3>
              <h4 style="margin: 5px 0; font-size: 1.2rem; color: #333;">Mã số: ${top3Candidates[1][0]}</h4>
              <p style="font-size: 1.6rem; font-weight: bold; color: #555;">${top3Candidates[1][4].toNumber()} phiếu</p>
            </div>

            
            <div class="hover-page" style="text-align: center; width: 35%; background: linear-gradient(135deg, #fff3cd, #fef9e7); border-radius: 15px; padding: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transform: translateY(-30px);">
              <img src="${top3Candidates[0][2]}" alt="${top3Candidates[0][1]}" 
                  style="width: 100px; height: 100px; border-radius: 50%; border: 6px solid gold;">
              <h3 style="margin-top: 10px; color: gold; font-weight: bold;">${top3Candidates[0][1]}</h3>
              <h4 style="margin: 5px 0; font-size: 1.2rem; color: #333;">Mã số: ${top3Candidates[0][0]}</h4>
              <p style="font-size: 1.6rem; font-weight: bold; color: #444;">${top3Candidates[0][4].toNumber()} phiếu</p>
            </div>

            
            <div class="hover-page" style="text-align: center; width: 30%; background: linear-gradient(135deg, #f3e5f5, #f8bbd0); border-radius: 15px; padding: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transform: translateY(20px);">
              <img src="${top3Candidates[2][2]}" alt="${top3Candidates[2][1]}" 
                  style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #cd7f32;">
              <h3 style="margin-top: 10px; color: #cd7f32; font-weight: bold;">${top3Candidates[2][1]}</h3>
              <h4 style="margin: 5px 0; font-size: 1.2rem; color: #333;">Mã số: ${top3Candidates[2][0]}</h4>
              <p style="font-size: 1.6rem; font-weight: bold; color: #555;">${top3Candidates[2][4].toNumber()} phiếu</p>
            </div>
          </div>

        `;
        topCandidatesContainer.append(topTemplate);

                
        // Vòng lặp để thêm toàn bộ ứng viên vào danh sách chọn
        candidates.forEach(function(candidate) {
          var id = candidate[0].toNumber();
          var name = candidate[1];
          
          // Thêm vào danh sách chọn
          var candidateOption = "<option value='" + id + "'>" + name + "</option>";
          candidatesSelect.append(candidateOption);
        });

        // Vòng lặp để hiển thị ứng viên từ vị trí thứ 4 trở đi trong bảng kết quả
        candidates.forEach(function(candidate) {
          var id = candidate[0].toNumber(); // Đảm bảo ID là số nguyên
          var name = candidate[1];
          var voteCount = candidate[4].toNumber(); // Đảm bảo số phiếu là số nguyên
          var imageURL = candidate[2]; // URL ảnh ứng viên
          var candidateInfo = candidate[3]; // Thông tin ứng viên
          totalVotes += voteCount; // Cộng dồn số phiếu

          // Hiển thị ứng cử viên trong bảng kết quả

          var candidateTemplate = `
            <tr>
              <th style="vertical-align: middle">${id}</th>
              <td style="vertical-align: middle"; width=21.6%><img src="${imageURL}" alt="${name}" style="width: 50px; height: 50px; border-radius: 50%;"></td>
              <td style="vertical-align: middle"; width=20%>${name}</td>
              <td style="vertical-align: middle"; width=37%>${candidateInfo}</td>
              <td style="vertical-align: middle"; width=10%>${voteCount}</td>
            </tr>`;
          candidatesResults.append(candidateTemplate);
        });
          
        // Hiển thị tổng số phiếu
        $("#totalVotes").html("Tổng số phiếu: " + totalVotes);

        // Kiểm tra xem người dùng đã bỏ phiếu hay chưa
        return electionInstance.voters(App.account);
      }).then(function(hasVoted) {
        if (hasVoted) {
          // Ẩn form bỏ phiếu nếu đã bỏ phiếu
          $('form').hide();
        }
        loader.hide();
        content.show(); // Hiển thị nội dung sau khi tải xong
      }).catch(function(error) {
        console.warn("Lỗi:", error);
        loader.hide(); // Ẩn loader ngay cả khi có lỗi
      });
    }).catch(function(error) {
      console.warn("Lỗi:", error);
      loader.hide(); // Ẩn loader ngay cả khi có lỗi
    });
  },

  // Hàm bỏ phiếu cho ứng cử viên
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      console.log("Bỏ phiếu thành công:", result);
      // Ẩn nội dung và hiển thị loader trong khi chờ cập nhật
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error("Lỗi khi bỏ phiếu:", err);
    });
  }
};

// Khi tải trang xong, khởi tạo ứng dụng
$(function() {
  $(window).load(function() {
    App.init();
  });
});
