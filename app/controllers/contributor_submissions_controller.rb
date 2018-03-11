class ContributorSubmissionsController < ApplicationController

  before_action :authenticate_user!
  before_action :set_contributor_submission, only: [:show, :edit, :update, :destroy]

  # GET /contributor_submissions
  # GET /contributor_submissions.json
  def index
    @contributor_submissions = current_user.contributor_submissions
  end

  # GET /contributor_submissions/1
  # GET /contributor_submissions/1.json
  def show
  end

  # GET /contributor_submissions/new
  def new
    @contributor_submission = current_user.contributor_submissions.build
  end

  # GET /contributor_submissions/1/edit
  def edit
  end

  # POST /contributor_submissions
  # POST /contributor_submissions.json
  def create
    @contributor_submission = current_user.contributor_submissions.build(contributor_submission_params)

    respond_to do |format|
      if @contributor_submission.save
        format.html { redirect_to contributor_submissions_path, notice: 'Contributor submission was successfully created.' }
        format.json { render :show, status: :created, location: @contributor_submission }
      else
        format.html { render :new }
        format.json { render json: @contributor_submission.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /contributor_submissions/1
  # PATCH/PUT /contributor_submissions/1.json
  def update
    respond_to do |format|
      if @contributor_submission.update(contributor_submission_params)
        format.html { redirect_to @contributor_submission, notice: 'Contributor submission was successfully updated.' }
        format.json { render :show, status: :ok, location: @contributor_submission }
      else
        format.html { render :edit }
        format.json { render json: @contributor_submission.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /contributor_submissions/1
  # DELETE /contributor_submissions/1.json
  def destroy
    @contributor_submission.destroy
    respond_to do |format|
      format.html { redirect_to contributor_submissions_url, notice: 'Contributor submission was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contributor_submission
      @contributor_submission = current_user.contributor_submissions.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def contributor_submission_params
      params.require(:contributor_submission).permit(:user_id, :title, :summary, :content, :submission_category_id, :status, :disclosure)
    end
end
