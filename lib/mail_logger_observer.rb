class MailLoggerObserver
  def self.delivered_email(mail)
    Rails.logger.tagged('MAIL') do
      Rails.logger.info mail
    end
  end
end
