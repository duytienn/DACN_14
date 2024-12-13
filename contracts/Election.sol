pragma solidity 0.4.25;

contract Election {
    // Mô hình một ứng viên
    struct Candidate {
        uint id;
        string name;
        string imageURL; // Thêm trường ảnh
        string candidateInfo; // Thêm trường thông tin ứng viên
        uint voteCount;
    }

    // Lưu trữ các tài khoản đã bỏ phiếu
    mapping(address => bool) public voters;
    // Lưu trữ các ứng viên
    // Truy xuất thông tin ứng viên
    mapping(uint => Candidate) public candidates;
    // Lưu trữ số lượng ứng viên
    uint public candidatesCount;

    // Sự kiện bỏ phiếu
    event votedEvent (
        uint indexed _candidateId
    );

    constructor () public {
        addCandidate("Ứng viên 1", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkGzXOcFZcNL8058KHlehxRY1rNaSPcQrnXQ&s", "Thông tin về ứng viên 1");
        addCandidate("Ứng viên 2", "https://hoangphucphoto.com/wp-content/uploads/2022/12/aenh-chan-dung.jpg", "Thông tin về ứng viên 2");
        addCandidate("Ứng viên 3", "https://www.yourstudiovn.com/uploads/hinhthe/IMG_2784_copy.jpg", "Thông tin về ứng viên 3");
        addCandidate("Ứng viên 4", "https://gcs.tripi.vn/public-tripi/tripi-feed/img/473782Qys/2m-studio-858536.jpg", "Thông tin về ứng viên 4");
        addCandidate("Ứng viên 5", "https://topquangngai.vn/wp-content/uploads/2021/02/chup-anh-the-dep-quang-ngai-2.jpg", "Thông tin về ứng viên 5");
        addCandidate("Ứng viên 6", "https://www.yourstudiovn.com/uploads/hinhthe/chup-anh-the-dep-nhat-TPHCM-13.jpg", "Thông tin về ứng viên 6");
    }

    function addCandidate (string _name, string _imageURL, string _candidateInfo) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _imageURL, _candidateInfo, 0);
    }

    function addCandidateWithVotes(string _name, string _imageURL, string _candidateInfo, uint _initialVotes) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _imageURL, _candidateInfo, _initialVotes);
    }

    function vote (uint _candidateId) public {
        // Yêu cầu rằng người bỏ phiếu chưa từng bỏ phiếu trước đó
        require(!voters[msg.sender]);

        // Yêu cầu một ứng viên hợp lệ
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // Ghi lại việc người bỏ phiếu đã bỏ phiếu
        voters[msg.sender] = true;

        // Cập nhật số phiếu cho ứng viên
        candidates[_candidateId].voteCount++;

        // Kích hoạt sự kiện đã bỏ phiếu
        emit votedEvent(_candidateId);
    }
}
