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
        addCandidate("Ứng viên 1", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 1");
        addCandidate("Ứng viên 2", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 2");
        addCandidate("Ứng viên 3", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 3");
        addCandidate("Ứng viên 4", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 4");
        addCandidate("Ứng viên 5", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 5");
        addCandidate("Ứng viên 6", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 6");
        addCandidate("Ứng viên 7", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 7");
        addCandidate("Ứng viên 8", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 8");
        //addCandidateWithVotes("Ứng viên 9", "https://images.pexels.com/photos/26447251/pexels-photo-26447251/free-photo-of-v-t-nuoi-meo-con-con-meo-d-t.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", "Thông tin về ứng viên 9", 100);
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